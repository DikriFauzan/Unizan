import express from "express";
import { listUsers, topUp } from "../admin/billingAdmin";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();

router.get("/admin/users", apiKeyGuard, listUsers);
router.post("/admin/topup", apiKeyGuard, topUp);

export default router;
