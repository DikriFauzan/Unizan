import express from "express";
import { apiKeyGuard } from "../middleware/apiKeyGuard";
import { 
    getAllUsersBilling,
    adjustQuota,
    ownerTopUp,
    adminTokenTransfer
} from "../admin/billingAdminController";

const router = express.Router();

router.get("/admin/billing/users", apiKeyGuard, async (req, res) => {
    const users = await getAllUsersBilling();
    res.json({ users });
});

router.post("/admin/billing/quota/adjust", apiKeyGuard, async (req, res) => {
    const { userId, amount } = req.body;
    const r = await adjustQuota(userId, amount);
    res.json({ status: "ok", updated: r });
});

router.post("/admin/billing/topup", apiKeyGuard, async (req, res) => {
    const { userId, amount } = req.body;
    const r = await ownerTopUp(userId, amount);
    res.json({ status: "ok", updated: r });
});

router.post("/admin/billing/transfer", apiKeyGuard, async (req, res) => {
    const { fromId, toId, amount } = req.body;
    const r = await adminTokenTransfer(fromId, toId, amount);
    res.json({ status: "ok", updated: r });
});

export default router;
