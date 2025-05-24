from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select

from app import crud
from app.ai.service import generate_text, generate_text_stream, generate_title
from app.api.deps import CurrentUserID, SessionDep
from app.api.schemas import ChatResponse, MessageRequest
from app.db.models import Chat, ChatMessage
from app.db.session import SessionLocal
from app.services.rag import get_relevant_context

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("/{chat_id}", response_model=ChatResponse)
async def read_chat(
    chat_id: str,
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    query = select(Chat).where(Chat.id == chat_id)
    chat = session.scalar(query)

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

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
    query = select(Chat).where(Chat.id == chat_id)
    chat = session.scalar(query)

    if chat:
        if chat.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    else:
        crud.create_chat(
            session=session,
            chat_id=chat_id,
            user_id=current_user_id,
        )

    crud.create_message(
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
        chat = session.get(Chat, chat_id)

        if not chat.title:
            chat.title = generate_title(chat.messages[0])
            session.commit()
            yield format_event("chat_title", chat.title)

        messages_text = "\n".join(f"{msg.role}: {msg.content}" for msg in chat.messages)

        query_prompt = f"""\
Deine Aufgabe ist es, eine Abfrage für eine Vektor-Datenbank anhand einer Chat-Historie zu erstellen. Das Ziel ist eine Abfrage zu formulieren, die die relevantesten Gesetzesartikel und Gerichtsentscheide in der Datenbank findet.

<chat_history>
{messages_text}
</chat_history>

Um eine effektive Abfrage zu erstellen:

1. Analysiere die Chat-Historie sorgfältig und konzentriere dich dabei auf:
   - Die hauptsächlichen rechtlichen Themen oder Probleme, die diskutiert wurden
   - Spezifische Gesetze, Artikel oder Gerichtsentscheidungen, die erwähnt wurden
   - Wichtige juristische Begriffe oder Konzepte, die verwendet wurden
2. Identifiziere die neueste und relevanteste Frage oder das Thema in der Chat-Historie.
3. Extrahiere wichtige Schlüsselwörter und Phrasen mit Bezug zum Schweizer Recht aus der Unterhaltung.
4. Kombiniere diese Elemente, um eine prägnante aber umfassende Abfrage zu erstellen, die dabei hilft, relevante Rechtsinformationen aus der Vektor-Datenbank abzurufen.
5. Stelle sicher, dass deine Abfrage auf Deutsch ist, da sie zum Durchsuchen von Schweizer Rechtstexten verwendet wird.

Antworte nur mit einer einzigen Abfrage, ohne weitere Erklärungen oder zusätzlichen Text.
"""

        query = generate_text([{"role": "user", "content": query_prompt}])
        context = get_relevant_context(session, query)

        message_dicts = [
            {"role": msg.role, "content": msg.content} for msg in chat.messages[:-1]
        ]

        answer_prompt = f"""\
Du bist ein hochqualifizierter KI-Assistent, der Fragen basierend auf einem gegebenen Kontext beantwortet. Deine Aufgabe ist es, die bereitgestellten Informationen sorgfältig zu analysieren und präzise Antworten zu formulieren.

Hier ist der Kontext, auf den du dich beziehen sollst:

<context>
{context}
</context>

Hier ist die Frage:
<question>
{chat.messages[-1].content}
</question>
"""
        message_dicts.append({"role": "user", "content": answer_prompt})

        assistant_message = ChatMessage(chat_id=chat_id, role="assistant", content="")
        session.add(assistant_message)
        session.commit()

        yield format_event("message_id", assistant_message.id)

        full_content = ""
        for delta in generate_text_stream(message_dicts):
            full_content += delta
            yield format_event("message_delta", delta)

        assistant_message.content = full_content
        session.commit()


def format_event(event_type: str, data: str):
    return f"event: {event_type}\ndata: {data}\n\n"
