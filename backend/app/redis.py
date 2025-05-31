import redis
from typing import AsyncGenerator

from app.core.config import settings


class RedisConnection:
    def __init__(self):
        self._redis = None

    def get_connection(self) -> redis.Redis:
        if self._redis is None:
            self._redis = redis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
            )
        return self._redis

    def close(self):
        if self._redis:
            self._redis.close()
            self._redis = None


redis_connection = RedisConnection()


def get_redis() -> redis.Redis:
    return redis_connection.get_connection()