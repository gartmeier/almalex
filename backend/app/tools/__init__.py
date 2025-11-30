from sqlalchemy.orm import Session

from app.tools import search as search_tools

ALL_TOOLS = search_tools.SEARCH_TOOLS


def call_function(*, db: Session, name: str, args: dict):
    if name == "legal_search":
        return search_tools.legal_search(db=db, **args)
    elif name == "article_lookup":
        return search_tools.article_lookup(db=db, **args)
    elif name == "decision_lookup":
        return search_tools.decision_lookup(db=db, **args)
    raise ValueError(f"Unknown function: {name}")
