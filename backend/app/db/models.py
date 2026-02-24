from datetime import date, datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Computed, DateTime, ForeignKey, Index, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.utils.helpers import nanoid


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
    context: Mapped[str | None]
    order: Mapped[int] = mapped_column(index=True)
    embedding: Mapped[Vector | None] = mapped_column(Vector(3584))
    text_search_vector = mapped_column(
        TSVECTOR,
        Computed("to_tsvector('simple', text)", persisted=True),
    )

    document = relationship("Document", back_populates="chunks")

    __table_args__ = (
        Index("idx_text_search_vector", "text_search_vector", postgresql_using="gin"),
    )


class Decision(Base):
    __tablename__ = "decision"

    id: Mapped[int] = mapped_column(primary_key=True)
    lang: Mapped[str] = mapped_column(index=True)
    court: Mapped[str] = mapped_column(index=True)
    reference: Mapped[str]
    date: Mapped[date]
    title: Mapped[str]
    html_url: Mapped[str | None]
    pdf_url: Mapped[str | None]
    text: Mapped[str | None]
    chamber: Mapped[str | None]
    headline: Mapped[dict | None] = mapped_column(JSONB)

    chunks = relationship(
        "Chunk", back_populates="decision", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("court", "reference"),)


class DecisionSyncState(Base):
    __tablename__ = "decision_sync_state"

    court: Mapped[str] = mapped_column(primary_key=True)
    last_job_sequence: Mapped[int | None]


class ActConfig(Base):
    __tablename__ = "act_config"
    sr_number: Mapped[str] = mapped_column(primary_key=True)
    generate_context: Mapped[bool] = mapped_column(default=False)


class Act(Base):
    __tablename__ = "act"

    id: Mapped[int] = mapped_column(primary_key=True)
    lang: Mapped[str] = mapped_column(index=True)
    sr_number: Mapped[str] = mapped_column(index=True)
    title: Mapped[str | None]
    abbr: Mapped[str | None]
    html_url: Mapped[str]
    xml_url: Mapped[str]
    applicability_date: Mapped[date]
    applicability_end_date: Mapped[date | None]

    __table_args__ = (UniqueConstraint("sr_number", "lang", "applicability_date"),)

    @property
    def label(self) -> str:
        parts = [f"SR {self.sr_number}"]
        if self.title:
            parts.append(self.title)
        if self.abbr:
            parts.append(f"({self.abbr})")
        return " ".join(parts)

    articles = relationship(
        "Article", back_populates="act", cascade="all, delete-orphan"
    )


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True)
    act_id: Mapped[int] = mapped_column(
        ForeignKey("act.id", ondelete="CASCADE"), index=True
    )
    eid: Mapped[str]
    breadcrumb: Mapped[str | None]
    html: Mapped[str]
    text: Mapped[str]
    context: Mapped[str | None]
    sort_order: Mapped[int] = mapped_column(index=True)

    act = relationship("Act", back_populates="articles")
    chunks = relationship(
        "Chunk",
        back_populates="article",
        cascade="all, delete-orphan",
        foreign_keys="Chunk.article_id",
    )


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


class Chat(Base):
    __tablename__ = "chat"

    id: Mapped[str] = mapped_column(primary_key=True)
    title: Mapped[str | None] = mapped_column(index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        index=True,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        index=True,
        onupdate=func.now(),
        server_default=func.now(),
    )

    messages: Mapped[list["ChatMessage"]] = relationship(
        "ChatMessage",
        back_populates="chat",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    __tablename__ = "chat_message"

    id: Mapped[str] = mapped_column(primary_key=True, default=nanoid)
    chat_id: Mapped[str] = mapped_column(
        ForeignKey("chat.id", ondelete="CASCADE"),
        index=True,
    )
    role: Mapped[str]
    content: Mapped[str]
    content_blocks: Mapped[list[dict]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )

    chat = relationship("Chat", back_populates="messages")
