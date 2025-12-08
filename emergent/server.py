from fastapi import FastAPI
from pydantic import BaseModel
from engine.core import EmergentBrain
from engine.memory import MemoryStore
import os, time

app = FastAPI()
brain = EmergentBrain()
memory = MemoryStore()

os.makedirs("/artifacts", exist_ok=True)

class Task(BaseModel):
    prompt: str
    depth: int = 3
    user: str = "public"

@app.post("/solve")
async def solve(task: Task):
    print(f"[EMERGENT] Running deep reasoning for '{task.prompt[:30]}...' depth={task.depth}")

    # 1. PROCESS REASONING
    reasoning = brain.reason(task.prompt, task.depth)

    # 2. PDF OUTPUT
    pdf_name = f"emergent_{int(time.time())}.pdf"
    pdf_path = brain.export_pdf(reasoning, pdf_name)

    # 3. SAVE MEMORY
    memory.push(task.user, task.prompt, reasoning)

    return {
        "engine": "FEAC-Emergent-v3",
        "output": reasoning,
        "pdf": pdf_path,
        "depth_used": task.depth,
        "memory_saved": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9001)
