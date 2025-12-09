import { Router } from "express";
import { AdminBillingController } from "../admin/adminBillingController";

const router = Router();
router.get("/stats", AdminBillingController.stats);

export default router;
