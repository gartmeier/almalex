from fastapi import APIRouter, Cookie, HTTPException
from fastapi.responses import StreamingResponse

from app.core.deps import SessionDep
from app.core.types import Language
from app.schemas.chat import ChatDetail, MessageCreate
from app.services import chat

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(chat_id: str, db: SessionDep):
    chat_obj = chat.get_chat(db=db, chat_id=chat_id)

    if not chat_obj:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat_obj


@router.post(
    "/{chat_id}/messages",
    response_class=StreamingResponse,
    responses={
        200: {
            "description": "Event stream",
            "content": {
                "text/event-stream": {"schema": {"type": "string", "format": "binary"}}
            },
        }
    },
    response_model=None,
)
async def create_message(
    chat_id: str,
    message_data: MessageCreate,
    db: SessionDep,
    lang: Language = Cookie(default="de"),
):
    chat_obj = chat.get_chat(db=db, chat_id=chat_id)

    if not chat_obj:
        chat_obj = chat.create_chat(db=db, chat_id=chat_id)

    chat.create_user_message(db=db, chat_id=chat_id, content=message_data.content)

    return StreamingResponse(
        chat.stream_completion(chat_obj.id, lang),
        media_type="text/event-stream",
    )
