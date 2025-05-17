import jwt

from app.core.config import settings

ALGORITHM = "HS256"


def encode_token(payload: dict):
    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=ALGORITHM,
    )


def decode_token(token: str):
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=[ALGORITHM],
    )
