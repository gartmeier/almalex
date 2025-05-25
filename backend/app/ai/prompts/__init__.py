from jinja2 import Environment, PackageLoader, select_autoescape

env = Environment(
    loader=PackageLoader("app.ai.prompts"),
    autoescape=select_autoescape(),
    trim_blocks=True,
    lstrip_blocks=True,
)


def render(template_name: str, **kwargs) -> str:
    template = env.get_template(template_name)
    return template.render(**kwargs)
