from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from app.api.deps import SessionDep
from app.crud.document import get_document

router = APIRouter(prefix="/documents", tags=["documents"])


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    url: str | None


@router.get("/{document_id}", response_model=DocumentRead)
def read_document(document_id: int, db: SessionDep):
    doc = get_document(db=db, document_id=document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
