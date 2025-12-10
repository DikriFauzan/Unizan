GEN24D — Aries Deep Context Engine (RAG + Memory Chain)

Endpoints:
- POST /v1/ai/memory/add  { namespace, key, content, ttl? }
- POST /v1/ai/rag         { namespace, prompt, topK? }

Notes:
- Embedding provider: ARIES (/embed) preferred; fallback via OPENAI proxy.
- Storage: currently JSON vector stored in DB. For production migrate to vector DB (Weaviate/Milvus/Pinecone).
- Must run prisma migrate if using Prisma schema changes.
- Security: apiKeyGuardOptional allows owner bypass; ensure proper middleware.
