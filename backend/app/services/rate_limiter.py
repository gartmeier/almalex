from datetime import datetime
from typing import Tuple

import redis


class WeeklyMessageLimiter:
    def __init__(self, redis_client: redis.Redis, limit: int = 10):
        self.redis = redis_client
        self.limit = limit

    def _get_week_key(self, user_id: str) -> str:
        year, week, _ = datetime.now().isocalendar()
        return f"messages:{user_id}:{year}:week{week}"

    def can_send_message(self, user_id: str) -> Tuple[bool, int]:
        key = self._get_week_key(user_id)

        if self.redis.setnx(key, self.limit):
            self.redis.expire(key, 7 * 24 * 60 * 60)  # 7 days in seconds

        current_remaining = self.redis.get(key)
        if current_remaining is None:
            return True, self.limit - 1

        current_remaining = int(current_remaining)
        return current_remaining > 0, current_remaining - 1

    def use_message(self, user_id: str) -> int:
        key = self._get_week_key(user_id)
        remaining = self.redis.decrby(key, 1)
        return max(0, remaining)

    def get_remaining_messages(self, user_id: str) -> int:
        key = self._get_week_key(user_id)
        remaining = self.redis.get(key)

        if remaining is None:
            return self.limit

        return max(0, int(remaining))
