GEN23 — RAG Integration Notes
------------------------------
Files added:
 - services/embeddingsAdapter.ts
 - services/vectorIndex.ts
 - services/retriever.ts
 - services/plannerRefine.ts
 - services/outputFilter.ts
 - routes/ragRoute.ts
 - frontend/admin/RagPlannerAdmin.tsx

Critical next steps (manual):
 1) Implement a real embeddings provider under backend/src/integrations/ (pinecone, milvus, redisvector, or custom).
 2) Implement provider vector driver backend/src/integrations/vector_<provider>.ts (upsert/query/delete).
 3) If using Prisma: add schema model for EmergentMemory / VectorMetadata and run migrations.
 4) Replace local fallback embedding with production embeddings (OpenAI, Llama2 embeddings, etc.) — butuh riset lanjutan
 5) Add secure rate-limiting and SuperKey permissions for RAG endpoints.

Security:
 - Do not use local placeholder embeddings in production.
 - Sanitize inputs and ensure exposed admin routes are protected by apiKeyGuard.

