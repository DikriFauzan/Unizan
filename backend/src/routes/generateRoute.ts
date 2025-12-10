import express from "express";
import { generate } from "../controllers/generateController";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

router.post("/generate", apiKeyGuard, generate);

export default router;
