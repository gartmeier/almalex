import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute

from app.api.main import api_router

sentry_sdk.init(
    dsn="https://663ebeb669ce01927244f8b53f424cea@o4507063971020800.ingest.us.sentry.io/4509672278786048",
)


app = FastAPI()
app.include_router(api_router, prefix="/api")

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
