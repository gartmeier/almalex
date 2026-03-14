from bs4 import BeautifulSoup
from markdownify import MarkdownConverter

from cli.utils.text import normalize_text

_md = MarkdownConverter(
    convert=["div", "p", "ul", "ol", "li", "dl", "dt", "dd", "table", "tr", "th", "td"]
)


def html_to_text(html: str) -> str:
    return normalize_text(_md.convert(html))


def soup_to_text(soup: BeautifulSoup) -> str:
    return normalize_text(_md.convert_soup(soup))
