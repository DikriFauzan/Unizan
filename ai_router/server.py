from fastapi import FastAPI
from src.router import RouteRequest, route

app = FastAPI()

@app.post("/route")
async def route_ai(req: RouteRequest):
    return route(req)
