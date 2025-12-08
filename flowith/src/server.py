from fastapi import FastAPI
from pydantic import BaseModel
from flowith_core import FlowithCore
import os

app = FastAPI()
engine = FlowithCore()

class Task(BaseModel):
    prompt: str
    depth: int = 3

@app.post("/analyze")
async def analyze(task: Task):
    print(f"[FLOWITH] Task: {task.prompt[:50]}... depth={task.depth}")
    result = engine.run(task.prompt, task.depth)
    return {
        "engine": "Flowith-v7",
        "output": result,
        "depth_used": task.depth
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9002)
