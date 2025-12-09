import prisma from "../config/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { broadcastBuildEvent } from "./wsBroadcast";

export async function createBuildJob(payload: any) {
  const id = uuidv4();
  const job = await prisma.buildJob.create({
    data: {
      id,
      userId: payload.userId,
      projectName: payload.projectName,
      repoUrl: payload.repoUrl,
      branch: payload.branch || "main",
      type: payload.type || "apk",
      isAuto: payload.isAuto === false ? false : true,
      status: "queued",
      progress: 0
    }
  });

  // Notify workers (simple queue: POST to local build-agent endpoint if exists)
  try {
    await axios.post(process.env.BUILD_AGENT_QUEUE_URL || "http://localhost:8081/queue", { jobId: id });
  } catch (e) {
    console.warn("Build queue notify failed:", e.message);
  }

  await broadcastBuildEvent(id, { type: "job:queued", jobId: id });

  return job;
}

export async function getJob(id: string) {
  return prisma.buildJob.findUnique({ where: { id }, include: { files: true, logs: true }});
}

export async function listJobs() {
  return prisma.buildJob.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
}

// Called by worker to update progress
export async function updateJobProgress(jobId: string, progress: number, status?: string) {
  const job = await prisma.buildJob.update({
    where: { id: jobId },
    data: { progress, status: status || undefined }
  });
  await broadcastBuildEvent(jobId, { type: "job:progress", progress, status: job.status });
  return job;
}

export async function addBuildFile(jobId: string, path: string, order = 0) {
  return prisma.buildFile.create({ data: { jobId, path, order, status: "pending" }});
}

export async function markFileDone(fileId: string, output?: string) {
  const f = await prisma.buildFile.update({ where: { id: fileId }, data: { status: "done", output }});
  await broadcastBuildEvent(f.jobId, { type: "file:done", fileId: f.id, path: f.path });
  return f;
}
