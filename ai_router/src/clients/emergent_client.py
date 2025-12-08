import requests
import os

EMERGENT_URL = os.getenv("EMERGENT_URL", "http://emergent:9001")

def ask_emergent(prompt: str, depth: int = 3):
    try:
        r = requests.post(f"{EMERGENT_URL}/solve", json={
            "prompt": prompt,
            "depth": depth
        }, timeout=8)
        
        if r.status_code == 200:
            return r.json()["output"]
        return None
    except:
        return None
