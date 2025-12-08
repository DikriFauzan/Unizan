import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

/**
 * OWNER ONLY: /v1/download/direct/:artifact
 */
router.get("/download/direct/:artifact", (req, res) => {
    const user = (req as any).user || {};

    if (user.email !== process.env.OWNER_EMAIL) {
        return res.status(403).json({ error: "Owner only" });
    }

    const artifactDir = path.resolve(__dirname, "../../../build-agent/artifacts");
    const file = path.join(artifactDir, req.params.artifact);

    if (!fs.existsSync(file)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.download(file);
});

export default router;
