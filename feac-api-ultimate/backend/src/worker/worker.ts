import { Queue, Worker, QueueScheduler, Job } from "bullmq";
import IORedis from "ioredis";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const connection = new IORedis(process.env.REDIS_URL || "redis://redis:6379");

const buildQueue = new Queue("feac:build", { connection });
new QueueScheduler("feac:build", { connection });

// Worker: process build jobs
const worker = new Worker("feac:build", async (job: Job) => {
  const payload = job.data;
  const buildId = job.id || uuidv4();
  const project = payload.projectName || "feac-app";
  const branch = payload.branch || "main";
  const timestamp = Date.now();
  const artifactName = `${project}_${branch}_${timestamp}.apk`;
  const artifactDir = path.resolve(__dirname, "../../../build-agent/artifacts");
  const artifactPath = path.join(artifactDir, artifactName);

  // Ensure artifacts directory
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  // Simulated build steps: in production replace with actual build commands
  await sendLog(job.id, "Starting build pipeline...");
  await runCmd(`echo "Cloning repo ${payload.gitUrl || 'local'}"`);
  await sendLog(job.id, "Cloning complete.");
  await sendLog(job.id, "Running gradle assemble (simulated)...");
  // Simulate build duration
  await sleep(2000);

  // Create dummy artifact
  fs.writeFileSync(artifactPath, `FAKE_APK_FOR:${project}@${branch}@${timestamp}`);
  await sendLog(job.id, `Artifact created: ${artifactName}`);

  // Signing hook placeholder (the build-agent signing pipeline should be integrated here)
  await sendLog(job.id, "Signing artifact (stub)...");
  await sleep(500);
  const signedPath = artifactPath.replace(".apk", "_signed.apk");
  fs.copyFileSync(artifactPath, signedPath);
  await sendLog(job.id, `Signed artifact: ${path.basename(signedPath)}`);

  // Save job result (simple file marker)
  const resultFile = path.join(artifactDir, `${buildId}.json`);
  fs.writeFileSync(resultFile, JSON.stringify({ buildId, artifact: path.basename(signedPath), status: "done", createdAt: new Date().toISOString() }));

  // Final log
  await sendLog(job.id, "Build complete. Artifact ready.");
  return { buildId, artifact: path.basename(signedPath), status: "done" };
}, {
  connection,
  concurrency: 2
});

// Utility: send log via Redis pubsub for WS server to pick up
async function sendLog(jobId: any, message: string) {
  const payload = JSON.stringify({ jobId, message, ts: Date.now() });
  await connection.publish("feac:build:logs", payload);
}

// util sleep and runCmd
function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }
function runCmd(cmd: string) {
  return new Promise<void>((resolve, reject) => {
    exec(cmd, { shell: "/bin/bash" }, (err, stdout, stderr) => {
      if (stdout) sendLog(null, stdout.toString()).catch(()=>{});
      if (stderr) sendLog(null, stderr.toString()).catch(()=>{});
      if (err) return reject(err);
      resolve();
    });
  });
}

// Graceful shutdown
process.on("SIGINT", async () => { await worker.close(); process.exit(0); });
process.on("SIGTERM", async () => { await worker.close(); process.exit(0); });

console.log("[WORKER] Build worker started.");
