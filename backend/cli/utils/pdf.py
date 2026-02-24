import pymupdf
import requests


def fetch_pdf_text(url: str) -> str:
    response = requests.get(url)
    response.raise_for_status()
    doc = pymupdf.open(stream=response.content, filetype="pdf")
    return "\n\n".join(page.get_text() for page in doc)
