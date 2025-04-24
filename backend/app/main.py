import jwt
from fastapi import FastAPI
from pydantic import BaseModel

from app.conf import settings
from app.utils import nanoid

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"


class Token(BaseModel):
    access_token: str


app = FastAPI()


@app.post("/token", response_model=Token)
async def create_token():
    access_token = jwt.encode(
        {
            "sub": nanoid(),
            "type": "anonymous",
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return Token(access_token=access_token)
