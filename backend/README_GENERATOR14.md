# Generator 14 — Realtime Build System

Files added:
- src/services/buildService.ts
- src/controllers/buildController.ts
- src/routes/buildRoute.ts
- src/ws/socket.ts
- build-agent/src/notify.js

Important:
- Prisma schema appended with model `Build`. Run migration:
  npx prisma migrate dev --name add_build_model
  or
  npx prisma db push

- Install deps for socket.io:
  cd backend && npm install socket.io

- If backend/src/index.ts was not automatically patched, ensure the HTTP server + attachSocket(server) are present.

- Build agent can call:
  node build-agent/src/notify.js http://<BACKEND>:8000 <buildId> running

