GEN24 — Model Bindings & Evaluator Notes
---------------------------------------
Files added:
 - integrations/model_aries.ts
 - integrations/model_openai.ts
 - integrations/model_gemini.ts
 - services/modelDispatcher.ts
 - services/evaluator.ts
 - controllers/generateController.ts
 - routes/generateRoute.ts
 - frontend/admin/ModelAdmin.tsx

Important manual steps:
 1) Implement real network bindings for Aries (superkey) in integrations/model_aries.ts
 2) Secure environment variables: OPENAI_API_KEY, GEMINI_KEY, ARIES_URL, FEAC_INTERNAL_KEY
 3) Harden apiKeyGuard middleware to attach apiKey and owner checks
 4) Implement persistent metrics collector or use Prometheus/StatsD (METRICS_COLLECTOR env)
 5) Add token accounting & billing hooks (Stripe) to charge non-owner requests
 6) Replace heuristic evaluator with learned quality evaluator if needed — butuh riset lanjutan

Security:
 - Never commit secrets.
 - Owner bypass should only be active for private owner keys and never exposed to public users.

