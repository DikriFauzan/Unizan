import redis
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_tokens(user_key: str) -> int:
    val = r.get(f"tokens:{user_key}")
    return int(val) if val else 0

def set_tokens(user_key: str, amount: int):
    r.set(f"tokens:{user_key}", amount)

def deduct(user_key: str, amount: int):
    current = get_tokens(user_key)
    new_amount = max(current - amount, 0)
    r.set(f"tokens:{user_key}", new_amount)
