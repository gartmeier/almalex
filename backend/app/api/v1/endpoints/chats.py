from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.clients import openai_client
from app.core.deps import get_session, session_context
from app.core.types import Language
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chat import ChatRequest
from app.schemas.events import Event
from app.services.chat_service import ChatService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService

router = APIRouter(tags=["chat"])


def get_chat_service(db: Session = Depends(get_session)) -> ChatService:
    return ChatService(
        chunk_repo=ChunkRepository(db),
        embedding_service=EmbeddingService(openai_client),
        llm_service=LLMService(openai_client),
    )


def format_sse(event: Event) -> str:
    return f"data: {event.model_dump_json()}\n\n"


@router.post("/chat", response_class=StreamingResponse, response_model=None)
async def create_message(
    request: ChatRequest,
    lang: Language = Cookie(default="de"),
):
    def event_stream():
        with session_context() as db:
            svc = ChatService(
                chunk_repo=ChunkRepository(db),
                embedding_service=EmbeddingService(openai_client),
                llm_service=LLMService(openai_client),
            )
            for event in svc.process_message(
                messages=request.messages,
                model=request.model,
                lang=lang,
            ):
                yield format_sse(event)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
