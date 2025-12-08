from pydantic import BaseModel
from .rules import TOKEN_RULES, OWNER_KEYS
from .userdb import get_tokens, deduct

class BillingRequest(BaseModel):
    api_key: str
    task_type: str
    code_units: int = 0

def calculate_cost(req: BillingRequest):
    # Owner unlimited
    if any(req.api_key.startswith(prefix) for prefix in OWNER_KEYS):
        return {"allowed": True, "cost": 0, "remaining": "UNLIMITED"}

    base_cost = TOKEN_RULES.get(req.task_type, 1)

    # Build mode
    if req.task_type == "build":
        base_cost = req.code_units * 50  # full code = 50 token/unit

    user_tokens = get_tokens(req.api_key)

    if user_tokens >= base_cost:
        deduct(req.api_key, base_cost)
        return {"allowed": True, "cost": base_cost, "remaining": user_tokens - base_cost}

    return {"allowed": False, "cost": base_cost, "remaining": user_tokens}
