import anthropic
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
from app.db.models import Act, ActConfig, Article, Chunk
from app.db.session import SessionLocal
from cli.utils import sparql
from cli.utils.context import generate_context_anthropic as generate_context
from cli.utils.html import fetch_html, md
from cli.utils.text import normalize_text, split_text


@click.command(name="load-fedlex")
@click.option("--lang", default="de", show_default=True)
@click.option("--sr-number")
@click.option("--force", is_flag=True, default=False)
@click.option("--enable-context", is_flag=True, default=False)
def load_fedlex_command(
    lang: str, sr_number: str | None, force: bool, enable_context: bool
):
    if enable_context:
        force = True
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
                if enable_context:
                    config = db.get(ActConfig, row.sr_number) or ActConfig(
                        sr_number=row.sr_number
                    )
                    config.generate_context = True
                    db.merge(config)
                    db.flush()

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
                click.echo(f"  {label}:")
                _process_act(db, act)
                db.commit()
                click.secho(f"  {label}: done", fg="green")
            except Exception as e:
                db.rollback()
                click.secho(f"  {label}: error — {e}", fg="yellow")

        click.secho("Done", fg="green")


def _process_act(db: Session, act: Act):
    click.echo("    Fetching HTML...")
    act_soup = fetch_html(act.html_url)
    act_label = act.label

    articles = _parse_articles(db, act, act_soup, act_label)
    chunks = _create_chunks(db, articles)
    click.echo(f"    {len(articles)} articles, {len(chunks)} chunks")

    act_config = db.get(ActConfig, act.sr_number) or ActConfig()
    if act_config.generate_context:
        act_text = md.convert_soup(act_soup)
        _generate_contexts(chunks, act_text, act.lang)

    _embed_chunks(chunks)
    db.flush()


def _parse_articles(db: Session, act: Act, act_soup, act_label: str) -> list[Article]:
    articles = []
    for sort_order, article_tag in enumerate(act_soup.find_all("article")):
        eid = article_tag.get("id", "")
        article_text = normalize_text(md.convert_soup(article_tag))
        breadcrumb_list = _section_headers(article_tag)
        breadcrumb_list.insert(0, act_label)
        breadcrumb = " | ".join(breadcrumb_list)
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
    db.flush()
    return articles


def _create_chunks(db: Session, articles: list[Article]) -> list[tuple[Article, Chunk]]:
    chunks = []
    for article in articles:
        for chunk_text in split_text(article.text):
            embedding_input = f"[{article.breadcrumb}]\n\n{chunk_text}"
            chunk = Chunk(
                source_type="article",
                article_id=article.id,
                text=chunk_text,
                embedding_input=embedding_input,
            )
            db.add(chunk)
            chunks.append((article, chunk))
    return chunks


def _generate_contexts(chunks: list[tuple[Article, Chunk]], act_text: str, lang: str):
    with click.progressbar(chunks, label="    context") as bar:
        for article, chunk in bar:
            chunk.context = _generate_context(act_text, chunk.text, lang=lang)
            chunk.embedding_input = (
                f"{article.breadcrumb}\n\n{chunk.context}\n\n{chunk.text}"
            )


@retry(
    retry=retry_if_exception_type(anthropic.RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def _generate_context(document_text, chunk_text, lang):
    return generate_context(document_text, chunk_text, lang)


def _embed_chunks(chunks: list[tuple[Article, Chunk]]):
    batch_size = 99  # Infomaniak requires less than 100
    batches = [chunks[i : i + batch_size] for i in range(0, len(chunks), batch_size)]
    with click.progressbar(batches, label="    embed") as bar:
        for batch in bar:
            response = _create_embedding([c.embedding_input for (_, c) in batch])
            for (_, chunk), data in zip(batch, response.data):
                chunk.embedding = data.embedding


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
        heading = section.find(class_="heading", recursive=False)
        if heading:
            headers.append(heading.get_text(" ", strip=True))
    headers.reverse()
    return headers
