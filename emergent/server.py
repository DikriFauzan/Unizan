from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from engine.reasoning import EmergentCore
import os

app = FastAPI()
brain = EmergentCore()

class Query(BaseModel):
    prompt: str
    depth: int = 3

@app.post("/solve")
async def solve(q: Query):
    print(f"Received emergent task: {q.prompt[:50]}...")
    reasoning_trace = brain.expand_thought(q.prompt, q.depth)
    
    return {
        "engine": "FEAC-Emergent-v2",
        "output": f"Emergent Reasoning Result:\n{reasoning_trace}\n\n[Final Answer derived from Deep Compute]",
        "cost_metric": q.depth * 10
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9001)
