from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.conf import settings
from app.utils import nanoid

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"


class Token(BaseModel):
    access_token: str


class User(BaseModel):
    user_id: str


app = FastAPI()

security = HTTPBearer()


def get_user_id(
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


@app.post("/api/token", response_model=Token)
async def create_token():
    access_token = jwt.encode(
        {"sub": nanoid()},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return Token(access_token=access_token)


@app.get("/api/user", response_model=User)
async def read_user(user_id: Annotated[str, Depends(get_user_id)]):
    return User(user_id=user_id)


@app.get("/api/limits")
async def read_limits(user_id: Annotated[str, Depends(get_user_id)]):
    return {"messages_remaining": 100}
