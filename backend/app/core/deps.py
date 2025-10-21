from typing import Annotated

import redis
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.redis import get_redis
from app.db.session import SessionLocal


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
