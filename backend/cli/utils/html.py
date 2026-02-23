import requests
from bs4 import BeautifulSoup
from markdownify import MarkdownConverter

md = MarkdownConverter(
    convert=["p", "ul", "ol", "li", "dl", "dt", "dd", "table", "tr", "th", "td"]
)


def fetch_html(url) -> BeautifulSoup:
    response = requests.get(url)
    response.raise_for_status()
    response.encoding = response.apparent_encoding
    return BeautifulSoup(response.text, "html.parser")
