from sqlalchemy.orm import Session

from app.tools import search as search_tools

ALL_TOOLS = search_tools.SEARCH_TOOLS


def call_function(*, db: Session, name: str, args: dict):
    if name == "search_legal_documents":
        return search_tools.search_legal_documents(db=db, **args)
    elif name == "lookup_law_article":
        return search_tools.lookup_law_article(db=db, **args)
    elif name == "lookup_court_decision":
        return search_tools.lookup_court_decision(db=db, **args)
    raise ValueError(f"Unknown function: {name}")
