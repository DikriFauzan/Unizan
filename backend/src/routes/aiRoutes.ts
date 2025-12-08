import { Router } from "express";
import { chat } from "../controllers/aiController";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = Router();
router.post("/chat", apiKeyGuard, chat);
export default router;
