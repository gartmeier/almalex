import pymupdf
import requests
from bs4 import BeautifulSoup

from app.core.config import settings

session = requests.Session()
ua = "AlmeLex"
if settings.contact_email:
    ua = f"AlmeLex ({settings.contact_email})"
session.headers["User-Agent"] = ua


def fetch_json(url: str):
    response = session.get(url)
    response.raise_for_status()
    return response.json()


def fetch_html(url: str) -> BeautifulSoup:
    response = session.get(url)
    response.raise_for_status()
    response.encoding = response.apparent_encoding
    return BeautifulSoup(response.text, "html.parser")


def fetch_pdf_text(url: str) -> str:
    response = session.get(url)
    response.raise_for_status()
    doc = pymupdf.open(stream=response.content, filetype="pdf")
    return "\n\n".join(page.get_text() for page in doc)
