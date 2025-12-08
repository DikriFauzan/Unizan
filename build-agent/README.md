FEAC Build Agent
================

Start:
 - Ensure Redis & MinIO running (docker-compose up)
 - Build agent image: docker build -t feac-build-agent ./build-agent
 - Run: docker run --env-file .env -v $(pwd)/build-agent/artifacts:/artifacts feac-build-agent

Notes:
 - Godot headless export and Android signing not implemented here.
 - To enable real builds:
   1) Install Godot 4.5.1 headless on runner and update worker.js to invoke it.
   2) Provide Android SDK & keytool/apksigner for signing.
   3) Implement secure keystore handling (avoid storing raw keystore in DB).
 - This agent uses BullMQ queue 'build-jobs' and expects jobs enqueued by backend.
 - Security: only accept build triggers from authenticated users (apiKeyGuard).
 - Marked steps: "butuh riset lanjutan".
