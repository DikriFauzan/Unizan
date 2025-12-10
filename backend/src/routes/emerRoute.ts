import express from "express";
import { addShortTerm, persistLongTerm } from "../services/emer-memory";
import { planFromPrompt } from "../services/emer-planner";
import { scoreOutput } from "../services/emer-scorer";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

// Request emergent plan
router.post("/emer/plan", apiKeyGuard, async (req, res) => {
  const { prompt, type } = req.body;
  const plan = planFromPrompt(prompt, type);
  await addShortTerm({ event: "plan:created", prompt, plan });
  res.json({ plan });
});

// Worker posts emergent result (executor: any)
router.post("/internal/emer/result", async (req, res) => {
  const { jobId, stepId, output } = req.body;
  const sc = scoreOutput(output || "");
  await persistLongTerm({ jobId, stepId, output, score: sc });
  res.json({ ok: true, score: sc });
});

export default router;
