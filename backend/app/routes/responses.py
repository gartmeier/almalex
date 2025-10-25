from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.db.session import SessionLocal
from app.schemas.response import ResponseRequest
from app.services import response

router = APIRouter(prefix="/responses", tags=["responses"])


@router.post("", response_class=StreamingResponse)
async def create_response(request: ResponseRequest):
    """Stream OpenAI response events."""

    def event_stream():
        db = SessionLocal()
        try:
            for event in response.generate_with_tools(
                db=db,
                conversation_id=request.conversation_id,
                message=request.message,
                effort=request.effort,
            ):
                yield f"data: {event.model_dump_json()}\n\n"
        finally:
            db.close()

    return StreamingResponse(event_stream(), media_type="text/event-stream")
