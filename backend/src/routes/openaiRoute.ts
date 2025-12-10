import express from "express";
import { openAIGenerate } from "../controllers/openaiController";
import { apiKeyGuardOptional } from "../middleware/apiKeyGuardOptional";

const router = express.Router();

router.post("/openai/generate", apiKeyGuardOptional, openAIGenerate);

export default router;
