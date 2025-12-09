import express from "express";
import { status } from "../controllers/superkeyAdminController";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

router.get("/admin/superkey/status", apiKeyGuard, status);

export default router;
