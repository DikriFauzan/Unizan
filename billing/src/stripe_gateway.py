import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_default")

def create_checkout(amount_usd: int, user_id: str):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "unit_amount": amount_usd * 100,
                "product_data": {"name": "FEAC Token Package"}
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url=f"https://feac.ai/success?uid={user_id}",
        cancel_url="https://feac.ai/cancel"
    )
    return session.url
