import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.v1.router import api_router as v1_router
from app.core.config import settings
from app.core.limiter import limiter

# Initialize Sentry only if DSN is configured
if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn)

app = FastAPI()

# Attach limiter to app state and add exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add SlowAPI middleware to inject rate limit headers
app.add_middleware(SlowAPIMiddleware)

app.include_router(v1_router, prefix="/api")

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
