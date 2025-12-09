SUPERKEY patch - quick guide
1. Set env in backend/.env (SUPERKEY_MODE, SUPERKEY_ENDPOINT, SUPERKEY_KEY).
2. Start docker: docker-compose up --build -d (will build superkey container).
3. SuperKey endpoint: POST /api/v1/generate { prompt, depth, producePdf }.
4. Admin routes exposed under backend: GET /v1/admin/superkey/status and POST /v1/admin/superkey/generate (protected by apiKeyGuard).
5. Artifacts PDFs stored at ./artifacts/superkey and served by your static server if enabled.
