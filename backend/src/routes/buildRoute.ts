import express from "express";
import { requestBuild, getBuildStatus, listBuilds } from "../controllers/buildController";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

router.post("/build/request", apiKeyGuard, requestBuild);
router.get("/build/status/:id", apiKeyGuard, getBuildStatus);
router.get("/build/list", apiKeyGuard, listBuilds);

export default router;
