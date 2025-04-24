from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.db.session import Base


class Document(Base):
    __tablename__ = "vector_search_document"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    source = Column(String)
    language = Column(String)
    metadata = Column(JSONB)

    chunks = relationship("DocumentChunk", back_populates="document")


class DocumentChunk(Base):
    __tablename__ = "vector_search_documentchunk"

    document_id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    order = Column(Integer)
    embedding = Column(Vector(1536), nullable=True)

    document = relationship("Document", back_populates="sections")
