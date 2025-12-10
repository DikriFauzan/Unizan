import express from "express";
import { addMemoryHandler, ragGenerateHandler } from "../controllers/ragController";
import { apiKeyGuardOptional } from "../middleware/apiKeyGuardOptional";

const router = express.Router();
router.post("/ai/memory/add", apiKeyGuardOptional, addMemoryHandler);
router.post("/ai/rag", apiKeyGuardOptional, ragGenerateHandler);
export default router;
