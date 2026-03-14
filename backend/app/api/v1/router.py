from fastapi import APIRouter

from app.api.v1.endpoints import chats

api_router = APIRouter()
api_router.include_router(chats.router)
