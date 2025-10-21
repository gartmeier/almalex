import re
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader(Path(__file__).parent),
    autoescape=select_autoescape(),
    trim_blocks=True,
    lstrip_blocks=True,
)


def inline_message(text):
    return re.sub(r"\s+", " ", text)


env.filters["inline_message"] = inline_message


def render(template_name: str, **kwargs) -> str:
    template = env.get_template(template_name)
    return template.render(**kwargs)
