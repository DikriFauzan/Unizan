import requests
import os

API_KEY = os.getenv("GOOGLE_API_KEY", "")

def ask_gemini(prompt: str):
    if not API_KEY:
        return None
    
    try:
        res = requests.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            params={"key": API_KEY},
            json={"contents":[{"parts":[{"text": prompt}]}]},
            timeout=10
        )
        if res.status_code == 200:
            data = res.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        return None
    except:
        return None
