import click
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Act, ActConfig, Article, Chunk
from app.db.session import SessionLocal
from cli.utils import sparql
from cli.utils.context import generate_context_anthropic as generate_context
from cli.utils.embedding import embed_chunks
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

    act_config = db.get(ActConfig, act.sr_number) or ActConfig(
        sr_number=act.sr_number,
        generate_context=False,
    )

    act_soup = fetch_html(act.html_url)
    act_text = md.convert_soup(act_soup) if act_config.generate_context else None

    articles = []
    chunks = []

    for sort_order, article_tag in enumerate(act_soup.find_all("article")):
        eid = article_tag.get("id")
        assert eid, f"article at position {sort_order} has no id"

        number_tag = article_tag.select_one(".heading > a")
        assert number_tag, f"no .heading > a in article {eid}"
        number = normalize_text(md.convert_soup(number_tag))

        collapseable = article_tag.find("div", class_="collapseable")
        assert collapseable, f"no .collapseable in article {eid}"
        text = normalize_text(md.convert_soup(collapseable))

        article = Article(
            act_id=act.id,
            eid=eid,
            number=number,
            html=str(article_tag),
            text=text,
            sort_order=sort_order,
        )
        db.add(article)
        articles.append(article)
        db.flush()

        breadcrumb = " > ".join(_section_headers(article_tag))
        context_header = f"{act.label} | {breadcrumb}"

        for chunk_text in split_text(article.text):
            context_parts = [context_header]

            if act_config.generate_context:
                context_parts.append(generate_context(act_text, chunk_text, act.lang))

            chunk_body = f"{article.citation}\n\n{chunk_text}"
            embedding_input = "\n\n".join(context_parts) + f"\n\n{chunk_body}"

            chunk = Chunk(
                source_type="article",
                article_id=article.id,
                text=chunk_body,
                embedding_input=embedding_input,
            )
            chunks.append(chunk)

    embed_chunks(chunks)

    db.add_all(chunks)
    db.flush()

    click.echo(f"    {len(articles)} articles, {len(chunks)} chunks")


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
