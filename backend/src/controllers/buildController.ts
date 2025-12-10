import { Request, Response } from "express";
import { createBuildJob, getJob, listJobs } from "../services/buildService";

export const requestBuild = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { projectName, repoUrl, branch, type, isAuto } = req.body;
    const job = await createBuildJob({ userId: user.id, projectName, repoUrl, branch, type, isAuto });
    res.json({ job });
  } catch (e:any) { res.status(500).json({ error: e.message }); }
};

export const getBuildStatus = async (req: Request, res: Response) => {
  try {
    const job = await getJob(req.params.id);
    res.json(job: any);
  } catch (e:any) { res.status(500).json({ error: e.message }); }
};

export const listBuilds = async (_req: Request, res: Response) => {
  try {
    const jobs = await listJobs();
    res.json({ jobs });
  } catch (e:any) { res.status(500).json({ error: e.message }); }
};
