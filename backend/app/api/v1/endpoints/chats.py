from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.clients import openai_client
from app.core.deps import get_session, session_context
from app.core.exceptions import NotFoundError
from app.core.types import Language
from app.repositories.chat_repository import ChatRepository
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chat import ChatDetail, MessageCreate
from app.schemas.events import Event
from app.services.chat_service import ChatService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService

router = APIRouter(prefix="/chats", tags=["chats"])


def get_chat_service(db: Session = Depends(get_session)) -> ChatService:
    return ChatService(
        chat_repo=ChatRepository(db),
        chunk_repo=ChunkRepository(db),
        embedding_service=EmbeddingService(openai_client),
        llm_service=LLMService(openai_client),
    )


def format_sse(event: Event) -> str:
    return f"data: {event.model_dump_json()}\n\n"


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(chat_id: str, svc: ChatService = Depends(get_chat_service)):
    chat = svc.get_chat(chat_id)
    if not chat:
        raise NotFoundError("Chat not found")
    return chat


@router.post(
    "/{chat_id}/messages",
    response_class=StreamingResponse,
    response_model=None,
)
async def create_message(
    chat_id: str,
    message_data: MessageCreate,
    lang: Language = Cookie(default="de"),
):
    def event_stream():
        with session_context() as db:
            svc = ChatService(
                chat_repo=ChatRepository(db),
                chunk_repo=ChunkRepository(db),
                embedding_service=EmbeddingService(openai_client),
                llm_service=LLMService(openai_client),
            )
            for event in svc.process_message(
                chat_id=chat_id, message=message_data.content, lang=lang
            ):
                yield format_sse(event)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
