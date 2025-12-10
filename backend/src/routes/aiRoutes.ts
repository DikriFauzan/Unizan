import { Router } from "express";
import { aiGenerate } from "../controllers/aiController";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = Router();
router.post("/aiGenerate", apiKeyGuard, aiGenerate);
export default router;
