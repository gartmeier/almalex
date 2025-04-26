from fastapi import APIRouter, status, HTTPException, Response
from sqlalchemy import select
from fastapi.responses import StreamingResponse

from app import crud
from app.api.deps import SessionDep, CurrentUserID
from app.api.schemas import ChatResponse, MessageRequest
from app.core.config import settings
from app.db.models import Chat

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


def stream_chat_completion(content):
    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)

    stream = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[
            {
                "role": "user",
                "content": content,
            },
        ],
        stream=True,
    )

    for chunk in stream:
        data = chunk.choices[0].delta.content
        if data:
            yield f"event: delta\ndata: {data}\n\n"


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
        stream_chat_completion(message_in.content), media_type="text/event-stream"
    )
