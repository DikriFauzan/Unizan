import express from "express";
import { planFromPrompt } from "../services/emer-planner";
import { refinePlan } from "../services/plannerRefine";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

router.post("/rag/plan", apiKeyGuard, async (req, res) => {
  try {
    const { prompt, type } = req.body;
    const base = planFromPrompt(prompt, type);
    const { refined, ctx } = await refinePlan(prompt, base);
    res.json({ base, refined, ctx });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
