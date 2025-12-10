import express from "express";
import { rerankHandler, composeHandler } from "../controllers/rerankController";
import { apiKeyGuardOptional } from "../middleware/apiKeyGuardOptional";
const router = express.Router();
router.post("/ai/rerank", apiKeyGuardOptional, rerankHandler);
router.post("/ai/compose", apiKeyGuardOptional, composeHandler);
export default router;
