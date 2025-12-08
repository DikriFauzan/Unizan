import express from "express";
import { apiKeyGuard } from "../middleware/apiKeyGuard";
import { BillingService } from "../billing/billingService";

const router = express.Router();

router.get("/billing/usage", apiKeyGuard, async (req: any, res) => {
    const usage = await BillingService.getUsage(req.user.id);
    const limit = req.user.role === "pro" ? 10000 : 2000;

    res.json({
        role: req.user.role,
        tier: req.user.tier,
        usage,
        limit,
        ownerBypass: req.user.role === "owner"
    });
});

// OWNER ONLY: RESET DAILY TOKEN
router.post("/billing/reset-daily", apiKeyGuard, async (req: any, res) => {
    if (req.user.role !== "owner")
        return res.status(403).json({ error: "OWNER_ONLY" });

    await BillingService.resetUsage("public-user"); // reset all free users
    res.json({ status: "reset_done" });
});

// Webhook stub
router.post("/billing/stripe/webhook", async (req, res) => {
    res.json({ status: "stripe_webhook_received" });
});

export default router;
