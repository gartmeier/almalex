from fastapi import APIRouter, Cookie, HTTPException
from fastapi.responses import StreamingResponse

from app.core.deps import SessionDep
from app.core.types import Language
from app.schemas.chat import ChatDetail, MessageCreate
from app.services import chat

router = APIRouter(tags=["chats"])


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(chat_id: str, db: SessionDep):
    chat_obj = chat.get_chat(db=db, chat_id=chat_id)

    if not chat_obj:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat_obj


@router.post(
    "/messages",
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
    message_in: MessageCreate,
    db: SessionDep,
    lang: Language = Cookie(default="de"),
):
    chat_obj = chat.get_chat(db=db, chat_id=message_in.chat_id)

    if not chat_obj:
        chat_obj = chat.create_chat(db=db, chat_id=message_in.chat_id)

    chat.create_user_message(db=db, message_in=message_in)

    return StreamingResponse(
        chat.stream_completion(chat_obj.id, lang),
        media_type="text/event-stream",
    )
