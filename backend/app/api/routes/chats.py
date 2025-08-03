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
from app.api.deps import (
    CurrentUserID,
    SessionDep,
    WeeklyMessageLimiterDep,
)
from app.api.schemas import (
    ChatCreate,
    ChatDetail,
    ChatListItem,
    ChatUpdate,
    MessageCreate,
    RateLimit,
)
from app.db.session import SessionLocal

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/rate-limit", response_model=RateLimit)
async def get_rate_limit(
    current_user_id: CurrentUserID,
    limiter: WeeklyMessageLimiterDep,
):
    remaining = limiter.get_remaining_messages(current_user_id)
    used = limiter.limit - remaining
    return RateLimit(
        remaining=remaining,
        used=used,
        max=limiter.limit,
    )


@router.post("/", response_model=ChatListItem, status_code=201)
async def create_chat(
    chat_create: ChatCreate,
    db: SessionDep,
    current_user_id: CurrentUserID,
):
    chat = crud.create_user_chat(
        db=db,
        chat_id=chat_create.id,
        user_id=current_user_id,
    )
    return chat


@router.get("/", response_model=list[ChatListItem])
async def list_chats(
    db: SessionDep,
    current_user_id: CurrentUserID,
):
    return crud.get_user_chats(db=db, user_id=current_user_id)


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(
    chat_id: str,
    db: SessionDep,
    current_user_id: CurrentUserID,
):
    chat = crud.get_user_chat(db=db, chat_id=chat_id, user_id=current_user_id)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    return chat


@router.put("/{chat_id}", status_code=204)
async def update_chat(
    chat_id: str,
    chat_update: ChatUpdate,
    db: SessionDep,
    current_user_id: CurrentUserID,
):
    updated = crud.update_user_chat(
        db=db,
        chat_id=chat_id,
        user_id=current_user_id,
        chat_update=chat_update,
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Chat not found")


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(
    chat_id: str,
    db: SessionDep,
    current_user_id: CurrentUserID,
):
    deleted = crud.delete_user_chat(db=db, chat_id=chat_id, user_id=current_user_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Chat not found")


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
    current_user_id: CurrentUserID,
    limiter: WeeklyMessageLimiterDep,
):
    can_send = limiter.can_send_message(current_user_id)

    if not can_send:
        raise HTTPException(
            status_code=429,
            detail="Weekly message limit exceeded. Try again next week.",
        )

    chat = crud.get_user_chat(db=db, chat_id=chat_id, user_id=current_user_id)

    if not chat:
        crud.create_user_chat(
            db=db,
            chat_id=chat_id,
            user_id=current_user_id,
        )

    crud.create_user_message(
        db=db,
        message_in=message_in,
        chat_id=chat_id,
    )

    limiter.use_message(current_user_id)

    return StreamingResponse(
        stream_chat_completion(chat_id),
        media_type="text/event-stream",
    )


def stream_chat_completion(chat_id: str):
    with SessionLocal() as db:
        chat = crud.get_chat(db=db, chat_id=chat_id)

        if chat is None:
            raise ValueError("Expected chat to exist")

        if not chat.title:
            generated_title = generate_title(chat.messages[0].content)

            chat.title = generated_title
            db.commit()

            yield format_event("chat_title", chat.title)

        assistant_message = crud.create_assistant_message(db=db, chat_id=chat_id)
        yield format_event("message_id", assistant_message.id)

        search_query = generate_query(chat.messages)
        yield format_event("search_query", search_query)

        query_embedding = create_embedding(search_query)
        relevant_chunks, matching_documents = crud.search_similar(
            db=db, embedding=query_embedding
        )

        # Send search results event
        document_results = [
            {
                "id": doc.id,
                "title": doc.title,
                "source": doc.source,
                "language": doc.language,
                "metadata": doc.metadata_,
            }
            for doc in matching_documents
        ]
        yield format_event("search_results", document_results)

        response_stream = generate_answer(
            messages=chat.messages, search_results=relevant_chunks
        )
        complete_response = ""

        for text_delta in response_stream:
            complete_response += text_delta
            yield format_event("message_delta", text_delta)

        assistant_message.content = complete_response
        db.commit()


def format_event(event_type: str, data: str | dict | list[dict]):
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
