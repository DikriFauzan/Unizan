import express from "express";
import { updateStatus, getStatus } from "../controllers/buildController";
const router = express.Router();

// Called by build-agent to update state
router.post("/build/update-status", updateStatus);

// Query status
router.get("/build/:buildId/status", getStatus);

export default router;
