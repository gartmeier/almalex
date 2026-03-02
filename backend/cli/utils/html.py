from markdownify import MarkdownConverter

md = MarkdownConverter(
    convert=["p", "ul", "ol", "li", "dl", "dt", "dd", "table", "tr", "th", "td"]
)
