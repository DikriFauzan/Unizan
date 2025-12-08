import express from "express";
import path from "path";
import fs from "fs";
import { validateSignedUrl, createSignedUrl } from "../utils/signedUrl";
import { TokenEngine } from "../billing/tokenEngine";

const router = express.Router();

/**
 * GET /v1/download/:token
 * Serve artifact by validating signed token. This endpoint does not charge;
 * charge happens when signed link is generated.
 */
router.get("/download/:token", async (req, res) => {
    const token = req.params.token;
    const valid = validateSignedUrl(token);

    if (!valid) {
        return res.status(403).json({ error: "Invalid or expired download token" });
    }

    const artifactDir = path.resolve(__dirname, "../../../build-agent/artifacts");
    const filePath = path.join(artifactDir, valid.artifact);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Artifact not found" });
    }

    return res.download(filePath);
});

/**
 * GET /v1/build/link/:artifact
 * Generate signed link for user
 * - Owner: returns direct link (no charge)
 * - Non-owner: attempts to charge tokens, only issues link if charge succeeds.
 */
router.get("/build/link/:artifact", async (req, res) => {
    try {
        const artifact = req.params.artifact;
        const user = (req as any).user || {};

        // Validate artifact exists (quick check)
        const artifactDir = path.resolve(__dirname, "../../../build-agent/artifacts");
        const filePath = path.join(artifactDir, artifact);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Artifact not found" });
        }

        // Owner bypass
        if (await TokenEngine.isOwner(user)) {
            return res.json({
                direct: true,
                url: `/v1/download/direct/${artifact}`
            });
        }

        // Non-owner: compute dynamic cost (default via env DOWNLOAD_COST)
        const cost = Number(process.env.DOWNLOAD_COST || 50);

        // Attempt to charge
        const charge = await TokenEngine.chargeForDownload(user, cost);
        if (!charge.ok) {
            return res.status(402).json({ error: charge.error || "PAYMENT_REQUIRED", remaining: charge.remaining || 0 });
        }

        // Create signed URL (6 hours)
        const token = createSignedUrl(artifact, 21600);
        return res.json({
            signed: true,
            url: `/v1/download/${token}`,
            expiresIn: "6h",
            charged: cost,
            remaining: charge.remaining
        });
    } catch (e: any) {
        console.error('[downloadRoute] error', e);
        return res.status(500).json({ error: 'SERVER_ERROR' });
    }
});

export default router;
