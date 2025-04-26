from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.db.session import Base


class Document(Base):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    source = Column(String, index=True, nullable=False)
    language = Column(String, index=True, nullable=False)
    metadata_ = Column("metadata", JSONB, nullable=False, default=dict)

    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )


class DocumentChunk(Base):
    __tablename__ = "document_chunk"

    id = Column(Integer, primary_key=True)
    document_id = Column(
        Integer,
        ForeignKey("document.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    text = Column(String, nullable=False)
    order = Column(Integer, index=True, nullable=False)
    embedding = Column(Vector(1536))

    document = relationship("Document", back_populates="chunks")


class Chat(Base):
    __tablename__ = "chat"

    id = Column(String, primary_key=True)
    user_id = Column(String, index=True, nullable=False)
    title = Column(String, index=True)
    created_at = Column(
        DateTime(timezone=True),
        index=True,
        nullable=False,
        server_default=func.now(),
    )
    updated_at = Column(
        DateTime(timezone=True),
        index=True,
        onupdate=func.now(),
        server_default=func.now(),
    )

    messages = relationship(
        "ChatMessage",
        back_populates="chat",
        cascade="all, delete-orphan",
    )


class ChatMessage(Base):
    __tablename__ = "chat_message"

    id = Column(String, primary_key=True)
    chat_id = Column(
        String,
        ForeignKey("chat.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    role = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
        nullable=False,
    )

    chat = relationship("Chat", back_populates="messages")
