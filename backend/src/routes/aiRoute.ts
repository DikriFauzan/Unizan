import express from "express";
import { aiGenerate } from "../controllers/aiController";
import { apiKeyGuardOptional } from "../middleware/apiKeyGuardOptional";

const router = express.Router();
router.post("/ai/generate", apiKeyGuardOptional, aiGenerate);
export default router;
