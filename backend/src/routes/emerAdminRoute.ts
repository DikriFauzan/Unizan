import express from "express";
import { status } from "../controllers/emerAdminController";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();
router.get("/admin/emer/status", apiKeyGuard, status);
export default router;
