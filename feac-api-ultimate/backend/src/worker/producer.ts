/**
 * Simple producer that bridges Redis LPUSH queue -> BullMQ queue
 * It polls LIST "feac:build:queue" and enqueues into Bull queue "feac:build"
 */
import IORedis from "ioredis";
import { Queue } from "bullmq";

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";
const redis = new IORedis(redisUrl);
const queue = new Queue("feac:build", { connection: redis });

async function loop() {
  while (true) {
    try {
      // BRPOP to pop newest added item (blocking pop with timeout)
      const item = await redis.brpop("feac:build:queue", 5); // [key, value] or null
      if (item) {
        const payload = JSON.parse(item[1]);
        // Enqueue to Bull with id = payload.id
        await queue.add("build-job", payload, { jobId: payload.id });
        await redis.publish("feac:build:logs", JSON.stringify({ jobId: payload.id, message: "Job moved to Bull queue", ts: Date.now() }));
      }
    } catch (e) {
      console.error("Producer error", e);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

loop().catch(console.error);
