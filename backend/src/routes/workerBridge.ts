import express from "express";
import prisma from "../config/db";
import { updateJobProgress, addBuildFile, markFileDone } from "../services/buildService";

const router = express.Router();

// Worker posts progress
router.post("/internal/build/progress", async (req, res) => {
  const { jobId, progress, status } = req.body;
  await updateJobProgress(jobId, progress, status);
  res.json({ ok: true });
});

// Worker posts file created
router.post("/internal/build/file", async (req, res) => {
  const { jobId, path, order } = req.body;
  const f = await addBuildFile(jobId, path, order);
  res.json(f: any);
});

// Worker marks file done
router.post("/internal/build/file/done", async (req, res) => {
  const { fileId, output } = req.body;
  const f = await markFileDone(fileId, output);
  res.json(f: any);
});

export default router;
