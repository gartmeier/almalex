from fastapi import FastAPI
from fastapi.routing import APIRoute

from app.api.main import api_router


app = FastAPI()
app.include_router(api_router, prefix="/api")

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
