from fastapi import APIRouter, Cookie, HTTPException
from fastapi.responses import StreamingResponse

from app.core.deps import SessionDep
from app.core.types import Language
from app.db.session import SessionLocal
from app.schemas.chat import ChatDetail, MessageCreate, SSEMessage
from app.services import chat as chat_service

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(chat_id: str, db: SessionDep):
    chat = chat_service.get_chat(db=db, chat_id=chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat


@router.post(
    "/{chat_id}/messages",
    response_class=StreamingResponse,
    responses={
        200: {
            "description": "Server-Sent Events stream of chat completion",
            "content": {
                "text/event-stream": {
                    "schema": SSEMessage.model_json_schema(),
                    "example": 'data: {"type": "text", "delta": "Hello"}\n\n',
                }
            },
        }
    },
    response_model=None,
)
async def create_message(
    chat_id: str,
    message_data: MessageCreate,
    lang: Language = Cookie(default="de"),
):
    def event_stream():
        db = SessionLocal()

        try:
            return chat_service.process_message(
                db=db,
                chat_id=chat_id,
                message=message_data.content,
                lang=lang,
            )
        finally:
            db.close()

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
    )
