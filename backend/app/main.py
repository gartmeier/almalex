from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.routing import APIRoute
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.api.schemas import ChatResponse, MessageCreate
from app.conf import settings
from app.db.models import Chat, ChatMessage
from app.db.session import get_db
from app.utils import nanoid

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"


class Token(BaseModel):
    access_token: str


class User(BaseModel):
    user_id: str


app = FastAPI()

security = HTTPBearer()


def get_current_user_id(
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Depends(security),
    ],
):
    try:
        token_data = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
        return token_data["sub"]
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


SessionDep = Annotated[Session, Depends(get_db)]
CurrentUserID = Annotated[str, Depends(get_current_user_id)]


@app.post("/api/token", response_model=Token)
async def create_token():
    access_token = jwt.encode(
        {"sub": nanoid()},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return Token(access_token=access_token)


@app.get("/api/chats/{chat_id}", response_model=ChatResponse)
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


@app.post(
    "/api/chats/{chat_id}/messages",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def create_message(
    chat_id: str,
    message_in: MessageCreate,
    session: SessionDep,
    current_user_id: CurrentUserID,
):
    query = select(Chat).where(Chat.id == chat_id)
    chat = session.scalar(query)

    if chat:
        if chat.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    else:
        chat = Chat(
            id=chat_id,
            user_id=current_user_id,
        )
        session.add(chat)
        session.commit()
        session.refresh(chat)

    message = ChatMessage(
        id=message_in.id or nanoid(),
        chat_id=chat.id,
        role="user",
        content=message_in.content,
    )

    session.add(message)
    session.commit()
    session.refresh(message)


for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
