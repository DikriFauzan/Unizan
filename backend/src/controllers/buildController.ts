import { Request, Response } from "express";
import { createOrUpdateBuild, getBuild } from "../services/buildService";
import { emitBuildEvent } from "../ws/socket";

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.buildId) return res.status(400).json({ error: "buildId required" });

    const b = await createOrUpdateBuild({
      buildId: body.buildId,
      userId: body.userId,
      project: body.project,
      branch: body.branch,
      status: body.status,
      artifact: body.artifact,
      logs: body.logs
    });

    // Emit realtime event
    emitBuildEvent(body.buildId, {
      buildId: b.buildId,
      status: b.status,
      artifact: b.artifact,
      logs: b.logs,
      updatedAt: b.updatedAt
    });

    return res.json({ ok: true, build: b });
  } catch (e: any) {
    console.error("updateStatus error:", e);
    return res.status(500).json({ error: e.message });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  const buildId = req.params.buildId;
  if (!buildId) return res.status(400).json({ error: "buildId required" });
  const b = await getBuild(buildId);
  if (!b) return res.status(404).json({ error: "not found" });
  res.json({ build: b });
};
