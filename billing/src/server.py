from fastapi import FastAPI
from pydantic import BaseModel
from billing_engine import check_and_deduct
from stripe_gateway import create_checkout

app = FastAPI()

class BillingRequest(BaseModel):
    api_key: str
    task_type: str
    code_units: int = 0

class Checkout(BaseModel):
    user_id: str
    amount: int

@app.post("/validate")
async def validate(b: BillingRequest):
    return check_and_deduct(b.api_key, b.task_type, b.code_units)

@app.post("/checkout")
async def checkout(c: Checkout):
    url = create_checkout(c.amount, c.user_id)
    return {"checkout_url": url}
