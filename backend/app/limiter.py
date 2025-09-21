"""Rate limiter configuration for the application."""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize rate limiter with IP-based rate limiting
limiter = Limiter(key_func=get_remote_address)
