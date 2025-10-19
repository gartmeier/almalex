from fastapi import APIRouter, Cookie, HTTPException
from fastapi.responses import StreamingResponse

from app import crud
from app.api.deps import SessionDep
from app.api.schemas import ChatDetail, MessageCreate
from app.core.types import Language
from app.services import chat_service

router = APIRouter(tags=["chats"])


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(chat_id: str, db: SessionDep):
    chat = crud.get_chat(db=db, chat_id=chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat


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
    chat = crud.get_chat(db=db, chat_id=message_in.chat_id)

    if not chat:
        chat = crud.create_chat(db=db, chat_id=message_in.chat_id)

    crud.create_user_message(db=db, message_in=message_in)

    return StreamingResponse(
        chat_service.stream_completion(chat.id, lang),
        media_type="text/event-stream",
    )
