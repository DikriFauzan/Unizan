import express from "express";
import path from "path";
import fs from "fs";
import { validateSignedUrl } from "../utils/signedUrl";

const router = express.Router();

/**
 * GET /v1/download/:token
 * Token berbentuk signed string (base64)
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

    res.download(filePath);
});

/**
 * GET /v1/build/link/:artifact
 * Generate signed link for user
 * If owner: return direct static link (no TTL)
 */
router.get("/build/link/:artifact", async (req, res) => {
    const artifact = req.params.artifact;

    // owner bypass
    const user = (req as any).user || {};
    if (user.email === process.env.OWNER_EMAIL) {
        return res.json({
            direct: true,
            url: `/v1/download/direct/${artifact}`
        });
    }

    const { createSignedUrl } = require("../utils/signedUrl");
    const token = createSignedUrl(artifact, 21600); // 6jam

    res.json({
        signed: true,
        url: `/v1/download/${token}`,
        expiresIn: "6h"
    });
});

export default router;
