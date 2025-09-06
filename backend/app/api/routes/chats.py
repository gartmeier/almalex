import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app import crud
from app.ai.service import (
    create_embedding,
    generate_answer,
    generate_query,
    generate_title,
)
from app.api.deps import SessionDep
from app.api.schemas import ChatCreate, ChatDetail, MessageCreate
from app.db.session import SessionLocal

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("/", response_model=ChatDetail, status_code=201)
async def create_chat(
    chat_create: ChatCreate,
    db: SessionDep,
):
    chat = crud.create_chat(
        db=db,
        chat_id=chat_create.id,
    )
    return chat


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(
    chat_id: str,
    db: SessionDep,
):
    chat = crud.get_chat(db=db, chat_id=chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat


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
    message_in: MessageCreate,
    db: SessionDep,
):
    chat = crud.get_chat(db=db, chat_id=chat_id)

    if not chat:
        crud.create_chat(
            db=db,
            chat_id=chat_id,
        )

    crud.create_user_message(
        db=db,
        message_in=message_in,
        chat_id=chat_id,
    )

    return StreamingResponse(
        stream_chat_completion(chat_id, message_in.content),
        media_type="text/event-stream",
    )


def stream_chat_completion(chat_id: str, message_content: str):
    """Stream chat completion with real-time events for title, search, and response."""
    with SessionLocal() as db:
        chat = crud.get_chat(db=db, chat_id=chat_id)
        if chat is None:
            raise ValueError("Expected chat to exist")

        # Generate title if needed
        if not chat.title:
            chat.title = generate_title(message_content)
            db.commit()
            yield format_event("chat_title", chat.title)

        # Create assistant message
        assistant_message = crud.create_assistant_message(db=db, chat_id=chat_id)
        yield format_event("message_id", assistant_message.id)

        # Generate search query and perform document search
        search_query = generate_query(chat.messages)
        yield format_event("search_query", search_query)

        query_embedding = create_embedding(search_query)
        document_chunks, documents = crud.search_similar(
            db=db, embedding=query_embedding
        )

        search_results = [
            {"id": doc.id, "title": doc.title, "url": doc.url} for doc in documents
        ]
        yield format_event("search_results", search_results)

        # Stream AI response
        response_stream = generate_answer(
            messages=chat.messages, search_results=document_chunks
        )
        complete_text = ""

        for text_delta in response_stream:
            complete_text += text_delta
            yield format_event("message_delta", text_delta)

        # Save complete response with search results
        assistant_message.content = complete_text  # For backwards compatibility
        assistant_message.content_blocks = [
            {
                "type": "search",
                "status": "completed",
                "query": search_query,
                "results": search_results,
            },
            {"type": "text", "text": complete_text},
        ]
        db.commit()


def format_event(event_type: str, data: str | dict | list[dict]):
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
