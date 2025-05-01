from fastapi import APIRouter, status, HTTPException, Response
from sqlalchemy import select
from fastapi.responses import StreamingResponse

from app import crud
from app.api.deps import SessionDep, CurrentUserID
from app.api.schemas import ChatResponse, MessageRequest
from app.db.models import Chat, ChatMessage
from app.db.session import SessionLocal
from app.services import ai

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
        crud.create_chat(
            session=session,
            chat_id=chat_id,
            user_id=current_user_id,
        )

    crud.create_message(
        session=session,
        message_in=message_in,
        chat_id=chat_id,
    )

    return StreamingResponse(
        stream_chat_completion(chat_id),
        media_type="text/event-stream",
    )


def stream_chat_completion(chat_id: str):
    with SessionLocal() as session:
        chat = session.get(Chat, chat_id)

        if not chat.title:
            stmt = (
                select(ChatMessage.content)
                .where(ChatMessage.chat_id == chat_id, ChatMessage.role == "user")
                .order_by(ChatMessage.id.asc())
                .limit(1)
            )
            first_user_message = session.scalar(stmt)
            chat.title = ai.generate_title(first_user_message)
            session.commit()

            yield f"event: chat_title\ndata: {chat.title}\n\n"

        message_dicts = []

        for message in chat.messages:
            message_dicts.append(
                {
                    "role": message.role,
                    "content": message.content,
                }
            )

        stream = ai.create_completion(message_dicts)

        yield "event: message_start\n\n"

        for delta in stream:
            yield f"event: message_delta\ndata: {delta}\n\n"

        yield "event: message_end\n\n"
