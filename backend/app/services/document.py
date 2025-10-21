from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Document


def get_document(db: Session, document_id: int):
    return db.scalar(select(Document).where(Document.id == document_id))
