"""Rate limit logging middleware and handlers."""

import logging
from datetime import datetime

from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware

# Configure logger
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("rate_limit")
logger.setLevel(logging.INFO)


async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for rate limit exceeded exceptions with logging."""
    # Extract rate limit details from the exception
    limit = getattr(exc, "detail", "Rate limit exceeded")

    # Get client IP
    client_ip = request.client.host if request.client else "unknown"

    # Log the rate limit violation
    logger.warning(
        f"Rate limit exceeded | IP: {client_ip} | "
        f"Path: {request.url.path} | Method: {request.method} | "
        f"Detail: {limit}"
    )

    # Return 429 response with appropriate headers
    response = JSONResponse(
        status_code=429,
        content={
            "error": "Too many requests",
            "message": "Rate limit exceeded. Please try again later.",
            "detail": str(limit),
        },
    )

    # The SlowAPI middleware will add the rate limit headers
    return response


class RateLimitLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log rate limit information from response headers."""

    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"

        # Process the request
        response = await call_next(request)

        # Check for rate limit headers in response
        limit = response.headers.get("X-RateLimit-Limit")
        remaining = response.headers.get("X-RateLimit-Remaining")
        reset = response.headers.get("X-RateLimit-Reset")

        # Log rate limit info if headers are present
        if limit and remaining is not None:
            # Convert remaining to int for comparison
            try:
                remaining_int = int(remaining)
                limit_int = int(limit)

                # Calculate usage percentage
                usage_percent = (
                    ((limit_int - remaining_int) / limit_int * 100)
                    if limit_int > 0
                    else 0
                )

                # Get reset time if available
                reset_time = (
                    datetime.fromtimestamp(int(reset)).strftime("%H:%M:%S")
                    if reset
                    else "unknown"
                )

                # Log warning if approaching limit (80% usage)
                if usage_percent >= 80:
                    logger.warning(
                        f"Rate limit approaching | IP: {client_ip} | "
                        f"Path: {request.url.path} | "
                        f"Remaining: {remaining}/{limit} ({usage_percent:.0f}% used) | "
                        f"Reset: {reset_time}"
                    )
                else:
                    # Always log rate limit status for tracked endpoints
                    logger.info(
                        f"Rate limit status | IP: {client_ip} | "
                        f"Path: {request.url.path} | Method: {request.method} | "
                        f"Status: {response.status_code} | "
                        f"Remaining: {remaining}/{limit} ({usage_percent:.0f}% used) | "
                        f"Reset: {reset_time}"
                    )

            except (ValueError, TypeError):
                pass

        return response
