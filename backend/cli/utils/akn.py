import logging
import re

import bs4

logger = logging.getLogger(__name__)


class AKN2Text:
    def convert(self, tag: bs4.Tag):
        return self.process_tag(tag).strip()

    def process_element(self, element: bs4.PageElement, parent_tags: list[str] = None):
        if isinstance(element, bs4.Tag):
            return self.process_tag(element, parent_tags)
        return str(element)

    def process_tag(self, tag: bs4.Tag, parent_tags: list[str] = None):
        parent_tags = parent_tags or []

        parent_tags_for_children = parent_tags.copy()
        parent_tags_for_children.append(tag.name)

        text = ""

        for child in tag.children:
            text += self.process_element(child, parent_tags_for_children)

        match tag.name:
            case "article":
                text = self.process_article(tag, text, parent_tags)
            case "subdivision":
                text = self.process_subdivision(tag, text, parent_tags)
            case "heading":
                text = self.process_heading(tag, text, parent_tags)
            case "paragraph":
                text = self.process_paragraph(tag, text, parent_tags)
            case "num":
                text = self.process_num(tag, text, parent_tags)
            case "inline":
                text = self.process_inline(tag, text, parent_tags)

            case "blockList":
                text = self.process_list(tag, text, parent_tags)
            case "listIntroduction":
                text = self.process_list_intro(tag, text, parent_tags)
            case "item":
                text = self.process_list_item(tag, text, parent_tags)

            case "table":
                text = self.process_table(tag, text, parent_tags)

            case "p":
                text = self.process_p(tag, text, parent_tags)
            case "br":
                text = "\n"

            case _:
                logger.debug(f"Unhandled tag: {tag.name}")

        if tag.get("fedlex:message"):
            text = ""

        return text

    def process_article(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        text = ""

        heading = tag.find("heading", recursive=False)
        if heading:
            heading_text = self.process_tag(heading, parent_tags)
            text += f"{heading_text.strip()}\n\n"

        paragraphs = tag.find_all("paragraph", recursive=False)
        for paragraph in paragraphs:
            text += self.process_tag(paragraph, parent_tags)

        subdivisions = tag.find_all("subdivision", recursive=False)
        if subdivisions:
            text = f"{text.strip()}\n\n"

            for subdivision in subdivisions:
                text += self.process_tag(subdivision, parent_tags)

        return text.strip()

    def process_subdivision(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        text = ""

        num = tag.find("num", recursive=False)
        if num:
            text += self.process_tag(num, parent_tags)

        heading = tag.find("heading", recursive=False)
        if heading:
            text += self.process_tag(heading, parent_tags)

        text = f"{text.strip()}\n\n"

        paragraphs = tag.find_all("paragraph", recursive=False)
        for paragraph in paragraphs:
            text += self.process_tag(paragraph, parent_tags)

        return f"{text.strip()}\n\n"

    def process_heading(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return f"{text.rstrip()}\n\n"

    def process_paragraph(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return text

    def process_num(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return f"{text.strip()} "

    def process_inline(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return tag.get_text()

    def process_list(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return text

    def process_list_intro(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return f"{text}\n"

    def process_list_item(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        level = parent_tags.count("blockList")
        indent = "\t" * level
        return f"{indent}{text.strip()}\n"

    def process_table(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        table = "\n"

        for tr in tag.find_all("tr"):
            table += "|"

            for td in tr.find_all("td"):
                col = self.process_element(td).replace("\n", " ").replace("\t", " ")
                col = re.sub(r"\s+", " ", col)
                table += f" {col} |"

            table += "\n"

        table += "\n"

        return table

    def process_p(self, tag: bs4.Tag, text: str, parent_tags: list[str]):
        return f"{text}\n"


def akn_to_text(el: bs4.Tag) -> str:
    converter = AKN2Text()
    return converter.convert(el)
