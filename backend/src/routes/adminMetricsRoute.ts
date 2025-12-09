import express from "express";
import { metricsHandler } from "../monitoring/metrics";
import { apiKeyGuard } from "../middleware/apiKeyGuard";
import { superkeyHealth } from "../services/superkeyService";

const router = express.Router();

// Prometheus-compatible /metrics
router.get("/admin/metrics", apiKeyGuard, metricsHandler);

// Aggregate health check: superkey, emergent, db health (best-effort)
router.get("/admin/health", apiKeyGuard, async (req, res) => {
  const sk = await superkeyHealth();
  // You can extend to check DB/Redis/emergent
  const health = {
    superkey: !!sk,
    superkey_detail: sk || null,
    status: (!!sk) ? "ok" : "degraded"
  };
  res.json(health);
});

export default router;
