from typing import Annotated

import jwt
import redis
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import SessionLocal
from app.redis import get_redis

security = HTTPBearer()


def get_current_user_id(
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Depends(security),
    ],
):
    try:
        token_data = decode_token(credentials.credentials)
        return token_data["sub"]
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


CurrentUserID = Annotated[str, Depends(get_current_user_id)]


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


SessionDep = Annotated[Session, Depends(get_session)]


def get_redis_connection():
    return get_redis()


RedisDep = Annotated[redis.Redis, Depends(get_redis_connection)]
