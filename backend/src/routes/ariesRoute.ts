import express from "express";
import { ariesGenerate } from "../controllers/ariesController";
import { apiKeyGuardOptional } from "../middleware/apiKeyGuardOptional";

const router = express.Router();

// Use optional API key middleware: allows missing key for public internal flows (you can change to required)
router.post("/aries/generate", apiKeyGuardOptional, ariesGenerate);

export default router;
