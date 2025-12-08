import os
import json

class MemoryStore:
    def __init__(self):
        self.file_path = "/app/memory/memory.json"
        os.makedirs("/app/memory", exist_ok=True)
        if not os.path.exists(self.file_path):
            with open(self.file_path, "w") as f:
                f.write("{}")

    def load(self):
        try:
            with open(self.file_path, "r") as f:
                return json.load(f)
        except:
            return {}

    def save(self, data: dict):
        with open(self.file_path, "w") as f:
            json.dump(data, f, indent=2)

    def push(self, user: str, prompt: str, output: str):
        m = self.load()
        if user not in m:
            m[user] = []
        m[user].append({"prompt": prompt, "output": output})
        self.save(m)
