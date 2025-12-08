import crypto from "crypto";

const SECRET = process.env.FEAC_DOWNLOAD_SECRET || "local-dev-secret";

/**
 * Generate signed download token
 * @param artifact string
 * @param ttlSec number (default 6 hours)
 */
export function createSignedUrl(artifact: string, ttlSec = 21600) {
    const expiry = Math.floor(Date.now() / 1000) + ttlSec;
    const payload = `${artifact}:${expiry}`;
    const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    const token = Buffer.from(`${artifact}:${expiry}:${sig}`).toString("base64");
    return token;
}

/**
 * Validate signed token
 */
export function validateSignedUrl(token: string) {
    try {
        const raw = Buffer.from(token, "base64").toString("utf8");
        const [artifact, expiry, sig] = raw.split(":");
        if (!artifact || !expiry || !sig) return null;

        const now = Math.floor(Date.now() / 1000);
        if (now > Number(expiry)) return null;

        const payload = `${artifact}:${expiry}`;
        const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
        if (expected !== sig) return null;

        return { artifact };
    } catch {
        return null;
    }
}
