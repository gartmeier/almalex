import logging

import sentry_sdk
from fastapi import FastAPI, HTTPException
from fastapi.routing import APIRoute
from redis.exceptions import RedisError
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.v1.router import api_router as v1_router
from app.core.config import settings
from app.core.limiter import limiter
from app.core.redis import get_redis
from app.db.session import SessionLocal

# Initialize Sentry only if DSN is configured
if settings.debug:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("%(asctime)s %(name)s %(message)s"))
    _app_logger = logging.getLogger("app")
    _app_logger.setLevel(logging.INFO)
    _app_logger.addHandler(_handler)

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn)

app = FastAPI()

# Attach limiter to app state and add exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add SlowAPI middleware to inject rate limit headers
app.add_middleware(SlowAPIMiddleware)

app.include_router(v1_router, prefix="/api")


@app.get("/health", include_in_schema=False)
def health():
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        get_redis().ping()
    except (SQLAlchemyError, RedisError) as error:
        raise HTTPException(status_code=503, detail="Dependency unavailable") from error

    return {"status": "ok"}

for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
