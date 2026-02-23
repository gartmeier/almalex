import click
import openai
from sqlalchemy import select
from sqlalchemy.orm import Session
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.clients import openai_client
from app.core.config import settings
from app.db.models import Act, ActConfig, Article, ArticleChunk
from app.db.session import SessionLocal
from cli.utils import sparql
from cli.utils.context import generate_context_anthropic
from cli.utils.html import fetch_html, md
from cli.utils.text import normalize_text, split_text


@click.command(name="load-fedlex")
@click.option("--lang", default="de", show_default=True)
@click.option("--sr-number")
@click.option("--force", is_flag=True, default=False)
def load_fedlex_command(lang: str, sr_number: str | None, force: bool):
    with SessionLocal() as db:
        rows = sparql.fetch_all(lang, sr_number)
        click.echo(f"Fetched {len(rows)} acts from Fedlex")

        q = select(Act).where(Act.lang == lang)
        if sr_number:
            q = q.where(Act.sr_number == sr_number)
        existing = {
            (act.sr_number, str(act.applicability_date)): act
            for act in db.scalars(q).all()
        }

        for row in rows:
            label = row.abbr or row.title or row.sr_number
            act = existing.get((row.sr_number, row.applicability_date))

            if act and not force:
                click.echo(f"  {label}: skipped")
                continue

            try:
                if act:
                    db.delete(act)
                    db.flush()

                act = Act(
                    lang=lang,
                    sr_number=row.sr_number,
                    title=row.title,
                    abbr=row.abbr,
                    html_url=row.html_url,
                    xml_url=row.xml_url,
                    applicability_date=row.applicability_date,
                    applicability_end_date=row.applicability_end_date,
                )
                db.add(act)
                db.flush()
                _process_act(db, act)
                db.commit()
                click.echo(f"  {label}: done")
            except Exception as e:
                db.rollback()
                click.secho(f"  {label}: error — {e}", fg="yellow")

        click.secho("Done", fg="green")


def _process_act(db: Session, act: Act):
    click.echo("    Fetching HTML...")
    act_soup = fetch_html(act.html_url)

    parts = [f"SR {act.sr_number}"]
    if act.title:
        parts.append(act.title)
    if act.abbr:
        parts.append(f"({act.abbr})")
    act_label = " ".join(parts)

    articles = []

    for sort_order, article_tag in enumerate(act_soup.find_all("article")):
        eid = article_tag.get("id", "")
        body = article_tag.find(class_="collapseable") or article_tag
        article_text = normalize_text(md.convert_soup(body))
        breadcrumb_list = _section_headers(article_tag)
        breadcrumb_list.insert(0, act_label)
        breadcrumb = f"[{' | '.join(breadcrumb_list)}]"
        article = Article(
            act_id=act.id,
            eid=eid,
            breadcrumb=breadcrumb,
            html=str(article_tag),
            text=article_text,
            sort_order=sort_order,
        )
        db.add(article)
        articles.append(article)

    click.echo(f"    Parsed {len(articles)} articles")
    db.flush()

    act_config = db.get(ActConfig, act.sr_number) or ActConfig()
    act_text = md.convert_soup(act_soup) if act_config.generate_context else None

    chunk_pairs = []
    for article in articles:
        for chunk_text in split_text(article.text):
            chunk = ArticleChunk(article_id=article.id, text=chunk_text)
            if act_config.generate_context:
                click.echo(
                    f"    Generating context for chunk {len(chunk_pairs) + 1}..."
                )
                chunk.context = _generate_context(act_text, chunk.text, lang=act.lang)
            db.add(chunk)
            chunk_pairs.append((article, chunk))

    click.echo(f"    Embedding {len(chunk_pairs)} chunks...")
    batch_size = 99  # Infomaniak requires less than 100
    for i in range(0, len(chunk_pairs), batch_size):
        batch = chunk_pairs[i : i + batch_size]
        input_ = [_embed_input(article, chunk) for article, chunk in batch]

        click.echo(
            f"    Batch {i // batch_size + 1}/{(len(chunk_pairs) + batch_size - 1) // batch_size}..."
        )
        response = _create_embedding(input_)

        for (_, chunk), embedding_data in zip(batch, response.data):
            chunk.embedding = embedding_data.embedding

    db.flush()


@retry(
    retry=retry_if_exception_type(openai.RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def _generate_context(document_text, chunk_text, lang):
    return generate_context_anthropic(document_text, chunk_text, lang)


def _embed_input(article: Article, chunk: ArticleChunk):
    parts = [article.breadcrumb]
    if chunk.context:
        parts.append(chunk.context)
    parts.append(chunk.text)
    return "\n\n".join(parts)


@retry(
    retry=retry_if_exception_type(openai.RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def _create_embedding(input_: list[str]):
    return openai_client.embeddings.create(
        model=settings.openai_embedding_model,
        input=input_,
    )


def _section_headers(tag):
    headers = []
    for section in tag.parents:
        if section.name != "section":
            continue
        sibling = section.find_previous_sibling(class_="heading")
        if sibling:
            headers.append(sibling.get_text(" ", strip=True))
    headers.reverse()
    return headers
