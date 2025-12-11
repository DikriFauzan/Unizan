/**
 * FEAC Key Manager — exposes safe operations for rotation & audit
 */
import { rotateKey, currentOwnerKey, listKeys, shouldRotate } from "./feac_key_rotation";
import { writeAudit } from "./feac_audit";

export function ensureRotationIfNeeded(triggerReason?: string) {
  try {
    if (shouldRotate()) {
      const rec = rotateKey(triggerReason);
      writeAudit("key.rotate", (process.env.FEAC_INTERNAL_KEY||"").slice(0,16), "owner", true, `rotated:${rec.id}`);
      return { status: "rotated", id: rec.id };
    } else {
      return { status: "ok", note: "not due" };
    }
  } catch (e: any) {
    writeAudit("key.rotate", (process.env.FEAC_INTERNAL_KEY||"").slice(0,16), "owner", false, e.message);
    throw e;
  }
}

export function getOwnerKeyMasked() {
  const k = currentOwnerKey();
  return k ? (k.slice(0,12) + "...") : null;
}

export function exportRecentKeys() {
  return listKeys(20).map(k => ({ id: k.id, createdAt: k.createdAt, meta: k.meta }));
}
