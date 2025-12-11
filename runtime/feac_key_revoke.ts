import * as fs from "fs";
import * as path from "path";

const STORE = path.join(process.env.HOME || ".", "feac_key_store.json");

export function revokeKey(keyId: string, meta?: any) {
  if (!fs.existsSync(STORE)) {
    return { status: "error", error: "store-not-found" };
  }

  const obj = JSON.parse(fs.readFileSync(STORE, "utf8"));
  obj.revoked = obj.revoked || {};

  obj.revoked[keyId] = {
    id: keyId,
    revokedAt: Date.now(),
    meta: meta || {}
  };

  fs.writeFileSync(STORE, JSON.stringify(obj, null, 2));
  return { status: "revoked", keyId };
}

export function isRevoked(keyId: string) {
  if (!fs.existsSync(STORE)) return false;
  const o = JSON.parse(fs.readFileSync(STORE, "utf8"));
  return !!(o.revoked && o.revoked[keyId]);
}

export function listRevoked() {
  if (!fs.existsSync(STORE)) return [];
  const o = JSON.parse(fs.readFileSync(STORE, "utf8"));
  return Object.values(o.revoked || {});
}
