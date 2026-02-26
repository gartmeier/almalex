from pgvector.sqlalchemy import Vector
from sqlalchemy import Computed, ForeignKey, Index
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Chunk(Base):
    __tablename__ = "chunk"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_type: Mapped[str]
    article_id: Mapped[int | None] = mapped_column(
        ForeignKey("article.id", ondelete="CASCADE"), index=True
    )
    decision_id: Mapped[int | None] = mapped_column(
        ForeignKey("decision.id", ondelete="CASCADE"), index=True
    )
    text: Mapped[str]
    context: Mapped[str | None]
    embedding_input: Mapped[str | None]
    embedding: Mapped[Vector | None] = mapped_column(Vector(3584))
    search_vector = mapped_column(
        TSVECTOR,
        Computed("to_tsvector('simple', text)", persisted=True),
    )

    article = relationship("Article", back_populates="chunks")
    decision = relationship("Decision", back_populates="chunks")

    __table_args__ = (Index("idx_chunk_tsv", "search_vector", postgresql_using="gin"),)
