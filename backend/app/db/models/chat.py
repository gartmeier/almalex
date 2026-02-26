from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.utils.helpers import nanoid


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
