import express from "express";
import { getLogs } from "../services/buildLogger";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

router.get("/build/logs/:id", apiKeyGuard, async (req, res) => {
    const logs = await getLogs(req.params.id);
    res.json({ logs });
});

export default router;
