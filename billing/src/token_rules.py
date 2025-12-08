TOKEN_RULES = {
    "chat_normal": 1,
    "chat_short_reasoning": 2,
    "chat_medium_reasoning": 5,
    "chat_long_reasoning": 10,
    "code_placeholder": 10,
    "code_unit": 50
}

def calculate_cost(task_type: str, code_units: int = 0):
    base = TOKEN_RULES.get(task_type, 1)
    if "code" in task_type:
        return base * max(1, code_units)
    return base
