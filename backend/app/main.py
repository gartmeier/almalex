import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.main import api_router
from app.limiter import limiter

sentry_sdk.init(
    dsn="https://663ebeb669ce01927244f8b53f424cea@o4507063971020800.ingest.us.sentry.io/4509672278786048",
)

app = FastAPI()

# Attach limiter to app state and add exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add SlowAPI middleware to inject rate limit headers
app.add_middleware(SlowAPIMiddleware)

app.include_router(api_router, prefix="/api")

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
