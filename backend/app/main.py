import jwt
from fastapi import FastAPI

from app.conf import settings
from app.utils import nanoid

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"

app = FastAPI()

@app.post("/token")
async def login_for_access_token():
    return jwt.encode({"sub": nanoid()}, SECRET_KEY, algorithm=ALGORITHM)
