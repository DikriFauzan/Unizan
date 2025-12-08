from fastapi import FastAPI
from src.engine import BillingRequest, calculate_cost

app = FastAPI()

@app.post("/validate")
def validate(req: BillingRequest):
    return calculate_cost(req)
