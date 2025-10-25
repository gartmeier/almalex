from pgvector.sqlalchemy import Vector
from sqlalchemy import Computed, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB, TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Document(Base):
    __tablename__ = "document"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    source: Mapped[str] = mapped_column(index=True)
    language: Mapped[str] = mapped_column(index=True)
    url: Mapped[str | None] = mapped_column(index=True)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)

    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )


class DocumentChunk(Base):
    __tablename__ = "document_chunk"

    id: Mapped[int] = mapped_column(primary_key=True)
    document_id: Mapped[int] = mapped_column(
        ForeignKey("document.id", ondelete="CASCADE"),
        index=True,
    )
    text: Mapped[str]
    order: Mapped[int] = mapped_column(index=True)
    embedding: Mapped[Vector | None] = mapped_column(Vector(1536))
    text_search_vector = mapped_column(
        TSVECTOR,
        Computed("to_tsvector('simple', text)", persisted=True),
    )

    document = relationship("Document", back_populates="chunks")

    __table_args__ = (
        Index("idx_text_search_vector", "text_search_vector", postgresql_using="gin"),
    )
