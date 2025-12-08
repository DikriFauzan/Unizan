import requests

class FEAC:
    def __init__(self, api_key, base="http://localhost:8000/v1"):
        self.key = api_key
        self.base = base

    def status(self):
        return requests.post("http://localhost:9004/status",
            json={"api_key": self.key}).json()

    def chat(self, msg, cost="CHAT"):
        return requests.post(f"{self.base}/ai/chat",
            headers={
                "x-api-key": self.key,
                "Content-Type": "application/json",
                "x-cost-type": cost
            },
            json={"messages":[{"role":"user","content":msg}]}
        ).json()
