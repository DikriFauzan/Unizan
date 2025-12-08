import express from "express";
import IORedis from "ioredis";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const redis = new IORedis(process.env.REDIS_URL || "redis://redis:6379");
const QUEUE_KEY = "feac:build:queue";

/**
 * Start build (enqueue)
 * Body: { projectName, gitUrl, branch, userId }
 */
router.post("/build/start", async (req, res) => {
  const payload = req.body || {};
  const buildId = uuidv4();
  // push job data into redis list or use bull queue (we will publish to bull via redis list consumer)
  // For compatibility with worker above (BullMQ), we will push to a dedicated Bull producer channel:
  const producerPayload = { id: buildId, ...payload };
  await redis.lpush(QUEUE_KEY, JSON.stringify(producerPayload));
  // Also publish a log event
  await redis.publish("feac:build:logs", JSON.stringify({ jobId: buildId, message: "Job enqueued", ts: Date.now() }));
  res.json({ buildId, status: "queued" });
});

/**
 * Build status: check artifact file in build-agent/artifacts/<buildId>.json
 */
router.get("/build/status/:id", async (req, res) => {
  const id = req.params.id;
  const artifactPath = `/root/build-agent/artifacts/${id}.json`; // NOTE: path depends on runtime
  // For safety, attempt to read via fs in backend runtime environment
  const fs = require("fs");
  try {
    if (fs.existsSync(artifactPath)) {
      const content = JSON.parse(fs.readFileSync(artifactPath).toString());
      return res.json({ status: "done", result: content });
    }
  } catch (e) { /* ignore */ }
  return res.json({ status: "pending" });
});

export default router;
