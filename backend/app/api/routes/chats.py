import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app import crud
from app.ai.service import (
    generate_answer,
    generate_title,
)
from app.api.deps import CurrentUserID, SessionDep
from app.api.schemas import ChatDetail, ChatListItem, MessageRequest
from app.db.session import SessionLocal

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/", response_model=list[ChatListItem])
async def list_chats(
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    return crud.get_user_chats(session=session, user_id=current_user_id)


@router.get("/{chat_id}", response_model=ChatDetail)
async def read_chat(
    chat_id: str,
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    chat = crud.get_user_chat(session=session, chat_id=chat_id, user_id=current_user_id)

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
    message_in: MessageRequest,
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    chat = crud.get_user_chat(session=session, chat_id=chat_id, user_id=current_user_id)

    if not chat:
        crud.create_chat(
            session=session,
            chat_id=chat_id,
            user_id=current_user_id,
        )

    crud.create_user_message(
        session=session,
        message_in=message_in,
        chat_id=chat_id,
    )

    return StreamingResponse(
        stream_chat_completion(chat_id),
        media_type="text/event-stream",
    )


def stream_chat_completion(chat_id: str):
    with SessionLocal() as session:
        chat = crud.get_chat(session=session, chat_id=chat_id)

        if not chat.title:
            title = generate_title(chat.messages[0])

            chat.title = title
            session.commit()

            yield format_event("chat_title", chat.title)

        assistant_message = crud.create_assistant_message(
            session=session, chat_id=chat_id
        )
        yield format_event("message_id", assistant_message.id)

        answer_stream = generate_answer(session, chat.messages)
        answer_text = ""

        for delta in answer_stream:
            answer_text += delta
            yield format_event("message_delta", delta)

        assistant_message.content = answer_text
        session.commit()


def format_event(event_type: str, data: str):
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
