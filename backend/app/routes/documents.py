from fastapi import APIRouter, HTTPException

from app.core.deps import SessionDep
from app.schemas.document import DocumentRead
from app.services.document import get_document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/{document_id}", response_model=DocumentRead)
def read_document(document_id: int, db: SessionDep):
    doc = get_document(db=db, document_id=document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
