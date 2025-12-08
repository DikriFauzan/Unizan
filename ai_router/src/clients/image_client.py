import requests
import os

OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")

def generate_image(prompt: str):
    if not OPENAI_KEY:
        return None

    try:
        res = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers={"Authorization": f"Bearer {OPENAI_KEY}"},
            json={"model": "gpt-image-1", "prompt": prompt},
            timeout=15
        )

        if res.status_code == 200:
            return res.json()["data"][0]["url"]
        return None
    except:
        return None
