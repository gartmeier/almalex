import json

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app import crud
from app.ai.service import (
    create_embedding,
    generate_answer,
    generate_query,
    generate_title,
)
from app.api.deps import SessionDep
from app.api.schemas import ChatCreate, ChatDetail, MessageCreate
from app.db.models import Chat, ChatMessage
from app.db.session import SessionLocal

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post(
    "",
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
async def create_chat(chat_create: ChatCreate, db: SessionDep):
    chat, message = crud.create_chat(
        db=db,
        chat_id=chat_create.id,
        message=chat_create.message,
    )

    return StreamingResponse(
        stream_initial_completion(chat, message),
        media_type="text/event-stream",
    )


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(chat_id: str, db: SessionDep):
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
async def create_message(chat_id: str, message_in: MessageCreate, db: SessionDep):
    chat = crud.get_chat(db=db, chat_id=chat_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    crud.create_user_message(
        db=db,
        message_content=message_in.content,
        chat_id=chat_id,
    )

    return StreamingResponse(
        stream_subsequent_completion(chat),
        media_type="text/event-stream",
    )


def stream_initial_completion(chat: Chat, message: ChatMessage):
    with SessionLocal() as db:
        db.add(chat)
        db.add(message)

        title = generate_title(message.content)
        chat.title = title
        db.commit()
        yield format_event("chat_title", title)

        yield from stream_completion(db, chat)


def stream_subsequent_completion(chat: Chat):
    with SessionLocal() as db:
        db.add(chat)

        yield from stream_completion(db, chat)


def stream_completion(db: Session, chat: Chat):
    # Get existing messages before creating the assistant message
    existing_messages = list(chat.messages)

    assistant_message = crud.create_assistant_message(db=db, chat_id=chat.id)
    yield format_event("message_id", assistant_message.id)

    search_query = generate_query(existing_messages)
    yield format_event("search_query", search_query)

    query_embedding = create_embedding(search_query)
    document_chunks, documents = crud.search_similar(db=db, embedding=query_embedding)

    search_results = [
        {"id": doc.id, "title": doc.title, "url": doc.url} for doc in documents
    ]
    yield format_event("search_results", search_results)

    response_stream = generate_answer(
        messages=existing_messages, search_results=document_chunks
    )
    complete_text = ""

    for text_delta in response_stream:
        complete_text += text_delta
        yield format_event("message_delta", text_delta)

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
