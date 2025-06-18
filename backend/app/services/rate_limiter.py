from datetime import datetime, timedelta, timezone

import redis.asyncio as redis


class RateLimitExceeded(Exception):
    pass


class RateLimiter:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.message_limit = 10
        self.window_days = 7

    async def check_rate_limit(self, user_id: str) -> bool:
        """
        Check if user has exceeded the rate limit of 10 messages in 7 days.
        Returns True if within limit, False if exceeded.
        """
        key = f"rate_limit:messages:{user_id}"
        current_time = datetime.now(timezone.utc)

        # Remove expired timestamps (older than 7 days)
        expire_time = current_time - timedelta(days=self.window_days)
        expire_timestamp = expire_time.timestamp()

        # Remove old entries
        await self.redis.zremrangebyscore(key, 0, expire_timestamp)

        # Count current messages in the window
        current_count = await self.redis.zcard(key)

        return current_count < self.message_limit

    async def record_message(self, user_id: str) -> None:
        """Record a new message for the user."""
        key = f"rate_limit:messages:{user_id}"
        current_timestamp = datetime.now(timezone.utc).timestamp()

        # Add current message timestamp to sorted set
        await self.redis.zadd(key, {str(current_timestamp): current_timestamp})

        # Set expiration for the key (8 days to be safe)
        await self.redis.expire(key, int(timedelta(days=8).total_seconds()))

    async def check_and_increase(self, user_id: str) -> None:
        if not await self.check_rate_limit(user_id):
            raise RateLimitExceeded()

        await self.record_message(user_id)
