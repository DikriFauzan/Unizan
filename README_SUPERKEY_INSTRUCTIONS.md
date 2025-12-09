SUPERKEY INSTRUCTIONS
- SuperKey service: superkey/src
- Build: docker build -t feac-superkey ./superkey
- Compose: docker-compose up --build -d superkey
- Config:
  * Set FEAC_INTERNAL_KEY in backend/.env to owner key (superkey bypass)
  * SUPERKEY_MODE: local | proxy
  * If proxy, set SUPERKEY_PROXY_URL to external LLM endpoint
- Test:
  curl -X POST http://localhost:9100/generate -H 'Content-Type: application/json' -d '{"key":"FEAC-SVR-...","prompt":"test"}'
