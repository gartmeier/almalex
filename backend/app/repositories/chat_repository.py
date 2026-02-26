from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Chat, ChatMessage
from app.repositories.base import BaseRepository


class ChatRepository(BaseRepository[Chat]):
    def __init__(self, db: Session):
        super().__init__(Chat, db)

    def get_with_messages(self, chat_id: str) -> Chat | None:
        return self.db.scalar(
            select(Chat).where(Chat.id == chat_id).options(selectinload(Chat.messages))
        )

    def get_or_create(self, chat_id: str) -> Chat:
        chat = self.db.scalar(select(Chat).where(Chat.id == chat_id))
        if chat is None:
            chat = self.create(Chat(id=chat_id))
        return chat

    def save_message(
        self, *, chat_id: str, role: str, content: str, content_blocks: list[dict]
    ) -> ChatMessage:
        msg = ChatMessage(
            chat_id=chat_id,
            role=role,
            content=content,
            content_blocks=content_blocks,
        )
        self.db.add(msg)
        self.db.commit()
        return msg

    def get_history(self, chat_id: str, limit: int = 10) -> list[ChatMessage]:
        rows = self.db.scalars(
            select(ChatMessage)
            .where(ChatMessage.chat_id == chat_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit)
        ).all()
        return list(reversed(rows))
