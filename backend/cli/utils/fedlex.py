from typing import cast

import requests
from bs4 import BeautifulSoup, Tag
from sqlalchemy.orm import Session

from app.db.models import Document, DocumentChunk
from cli.utils.akn import akn_to_text
from cli.utils.text import normalize_text, split_text


def process_fedlex_articles(
    db: Session,
    html_url: str,
    xml_url: str,
    sr_number: str,
    law_title: str,
    law_abbr: str | None,
) -> int:
    """Process Fedlex law by downloading HTML/XML and creating Document records
    for each article with associated text chunks. Returns number of articles processed."""
    html_response = requests.get(html_url)
    html_response.raise_for_status()
    html_response.encoding = html_response.apparent_encoding
    html_content = html_response.text
    html_root = BeautifulSoup(html_content, "html.parser")

    xml_response = requests.get(xml_url)
    xml_response.raise_for_status()
    xml_response.encoding = xml_response.apparent_encoding
    xml_content = xml_response.text
    xml_root = BeautifulSoup(xml_content, "xml")

    frbr_work_tag = cast(Tag, xml_root.find("FRBRWork"))
    frbr_url_tag = cast(Tag, frbr_work_tag.find("FRBRuri"))
    frbr_url_value = frbr_url_tag["value"]

    law_url = frbr_url_value.replace("fedlex.data.admin.ch", "www.fedlex.admin.ch")
    law_url = f"{law_url.rsplit('/', 1)[0]}/de"

    article_tags = cast(list[Tag], xml_root.find_all("article"))

    articles_added = 0

    for article_index, article_tag in enumerate(article_tags):
        article_id = article_tag["eId"]
        article_num_el = cast(Tag, article_tag.find("num", recursive=False))

        for note_el in article_num_el.find_all("authorialNote"):
            note_el.extract()

        article_num = normalize_text(article_num_el.get_text())
        article_title = f"{article_num} {law_abbr or law_title}"
        article_url = f"{law_url}#{article_id}"
        article_html_el = html_root.find(id=article_id)

        doc = Document(
            title=article_title,
            source="fedlex_article",
            language="de",
            url=article_url,
            metadata_={
                "sr_number": sr_number,
                "law_title": law_title,
                "law_abbr": law_abbr,
                "law_url": law_url,
                "article_index": article_index,
                "article_id": article_id,
                "article_num": article_num,
                "article_html": str(article_html_el),
                "article_xml": str(article_tag),
                "article_url": article_url,
            },
        )
        db.add(doc)
        db.flush()

        text = akn_to_text(article_tag)
        text = normalize_text(text)
        text_chunks = split_text(text)

        for chunk_index, chunk_text in enumerate(text_chunks):
            chunk = DocumentChunk(
                document_id=doc.id,
                text=chunk_text.strip(),
                order=chunk_index,
            )
            db.add(chunk)

        articles_added += 1

    return articles_added
