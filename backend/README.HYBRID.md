GEN24C — Hybrid AI Router (Aries primary → OpenAI fallback)

Endpoint: POST /v1/ai/generate
Body:
{
  "prompt": "hello"
}

Flow:
1. Try Aries first
2. If fails → fallback OpenAI
3. Adaptive latency scoring (self-optimizing)
4. Billing integrated
