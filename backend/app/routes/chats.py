from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.core.deps import SessionDep
from app.db.session import SessionLocal
from app.schemas.chat import MessageRequest
from app.services import chat as chat_service

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/{chat_id}")
async def read_chat(chat_id: str, db: SessionDep):
    """Get chat with conversation items from OpenAI."""
    chat = chat_service.get_chat(db=db, chat_id=chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat


@router.post("/{chat_id}/messages", response_class=StreamingResponse)
async def create_message(
    chat_id: str,
    message_data: MessageRequest,
):
    """Stream OpenAI response events."""

    def event_stream():
        db = SessionLocal()

        try:
            return chat_service.process_message(
                db=db,
                chat_id=chat_id,
                message=message_data.content,
            )
        finally:
            db.close()

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
    )
