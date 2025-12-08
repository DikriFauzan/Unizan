import redis
import time
from token_rules import calculate_cost

r = redis.Redis(host="redis", port=6379, decode_responses=True)

FREE_TIER_LIMIT = 2000

def is_superkey(api_key: str):
    return api_key.startswith("feac_core_superuser")

def get_month_key(api_key):
    month = time.strftime("%Y-%m")
    return f"usage:{api_key}:{month}"

def get_usage(api_key):
    key = get_month_key(api_key)
    used = r.get(key)
    return int(used) if used else 0

def add_usage(api_key, amount):
    key = get_month_key(api_key)
    r.incrby(key, amount)

def check_and_deduct(api_key: str, task_type: str, code_units: int = 0):
    if is_superkey(api_key):
        return {"allowed": True, "cost": 0, "reason": "superkey"}

    cost = calculate_cost(task_type, code_units)
    used = get_usage(api_key)

    if used + cost > FREE_TIER_LIMIT:
        return {"allowed": False, "cost": cost, "reason": "exceeded"}

    add_usage(api_key, cost)
    return {"allowed": True, "cost": cost, "reason": "charged"}
