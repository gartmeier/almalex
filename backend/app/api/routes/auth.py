from fastapi import APIRouter

from app.api.schemas import TokenResponse
from app.core.security import encode_token
from app.utils.helpers import nanoid

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/token", response_model=TokenResponse)
async def create_token():
    access_token = encode_token({"sub": nanoid()})
    return TokenResponse(access_token=access_token)
