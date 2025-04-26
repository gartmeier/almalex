from fastapi import APIRouter, status, HTTPException, Response
from sqlalchemy import select

from app.api.deps import SessionDep, CurrentUserID
from app.api.schema import ChatResponse, MessageRequest
from app.db.models import Chat, ChatMessage
from app.utils.helpers import nanoid

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/{chat_id}", response_model=ChatResponse)
async def read_chat(
    chat_id: str,
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    query = select(Chat).where(Chat.id == chat_id)
    chat = session.scalar(query)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return chat


@router.post(
    "{chat_id}/messages",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def create_message(
    chat_id: str,
    message_in: MessageRequest,
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    query = select(Chat).where(Chat.id == chat_id)
    chat = session.scalar(query)

    if chat:
        if chat.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    else:
        chat = Chat(
            id=chat_id,
            user_id=current_user_id,
        )
        session.add(chat)
        session.commit()
        session.refresh(chat)

    message = ChatMessage(
        id=message_in.id or nanoid(),
        chat_id=chat.id,
        role="user",
        content=message_in.content,
    )

    session.add(message)
    session.commit()
    session.refresh(message)
