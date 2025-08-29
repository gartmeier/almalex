import click
from sqlalchemy import select

from app.db.models import Document
from app.db.session import SessionLocal


@click.command()
def fix_fedlex_urls():
    with SessionLocal() as db:
        stmt = select(Document).where(Document.source == "fedlex_article")
        docs = db.scalars(stmt)

        for doc in docs:
            article_id = doc.metadata_["article_id"]

            url = doc.metadata_["law_url"]
            url = url.replace("fedlex.data.admin.ch", "www.fedlex.admin.ch")
            url_parts = url.rsplit("/", 1)

            doc.metadata_ = {
                "sr_number": doc.metadata_["sr_number"],
                "law_title": doc.metadata_["law_title"],
                "law_abbr": doc.metadata_["law_abbr"],
                "law_url": f"{url_parts[0]}/de",
                "article_index": doc.metadata_["article_index"],
                "article_id": doc.metadata_["article_id"],
                "article_num": doc.metadata_["article_num"],
                "article_html": doc.metadata_["article_html"],
                "article_xml": doc.metadata_["article_xml"],
                "article_url": f"{url_parts[0]}/de#{article_id}",
            }

        db.commit()
