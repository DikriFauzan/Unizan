from pydantic import BaseModel
from clients.gemini_client import ask_gemini
from clients.emergent_client import ask_emergent
from clients.flowith_client import ask_flowith
from clients.image_client import generate_image
import requests
import os

BILLING_URL = os.getenv("BILLING_URL", "http://billing:9003/validate")

class RouteRequest(BaseModel):
    api_key: str
    mode: str
    prompt: str
    code_units: int = 0

def route(task: RouteRequest):
    # Billing check
    billing = requests.post(BILLING_URL, json={
        "api_key": task.api_key,
        "task_type": task.mode,
        "code_units": task.code_units
    }).json()

    if not billing.get("allowed"):
        return {"error": "INSUFFICIENT_TOKENS", "need": billing.get("cost")}

    # Image mode
    if task.mode == "image":
        img = generate_image(task.prompt)
        if img:
            return {"provider": "OpenAI", "image_url": img}
        return {"error": "IMAGE_FAILED"}

    # Primary → Gemini
    out = ask_gemini(task.prompt)
    if out:
        return {"provider": "Gemini", "output": out}

    # Failover A → Emergent
    deep = ask_emergent(task.prompt, depth=3)
    if deep:
        return {"provider": "Emergent-Python", "output": deep}

    # Failover B → Flowith
    fw = ask_flowith(task.prompt)
    if fw:
        return {"provider": "Flowith", "output": fw}

    return {"error": "ALL_MODELS_OFFLINE"}
