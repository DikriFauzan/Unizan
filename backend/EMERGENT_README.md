Aries Emergent Loop Engine (GEN22)
----------------------------------
Files added (skeleton):
 - src/services/emer-memory.ts
 - src/services/emer-planner.ts
 - src/services/emer-scorer.ts
 - src/routes/emerRoute.ts
 - src/controllers/emerAdminController.ts
 - src/routes/emerAdminRoute.ts

Worker hooks:
 - build-agent/src/worker_hooks/emer_hook.js

Frontend:
 - frontend/src/admin/AriesEmergentAdmin.tsx

Important:
 - This is a skeleton. Model bindings, embeddings, retrieval-augmented generation,
   and heavy model files are NOT included. Implementing production LLM integration
   (local weights, cloud SDK) requires further research and secure provisioning.
   — butuh riset lanjutan

Suggested next steps:
 - wire embeddings store (e.g., Pinecone, Milvus, or self-hosted vector DB)
 - implement retrieval layer for longTerm memories
 - implement secure rate-limiting and SuperKey permission checks for emergent flows
 - write unit tests and an integration test that simulates a prompt->plan->execute->score cycle
