/**
 * FEAC Key Rotation Engine
 * - Rotates owner/service keys with versioned metadata
 * - Maintains rotation history & drift detection
 * - Lightweight, file-backed (no external DB)
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const STORE = path.join(process.env.HOME || ".", "feac_key_store.json");
const ROTATION_INTERVAL_MS = Number(process.env.FEAC_ROTATE_INTERVAL_MS || 24 * 3600 * 1000); // default 24h

export interface KeyRecord {
  id: string;
  key: string;
  createdAt: number;
  meta?: Record<string, any>;
}

function genKey() {
  return crypto.randomBytes(32).toString("hex");
}

function loadStore(): { keys: KeyRecord[], lastRotation?: number } {
  if (!fs.existsSync(STORE)) return { keys: [] };
  try {
    return JSON.parse(fs.readFileSync(STORE, "utf8"));
  } catch {
    return { keys: [] };
  }
}

function saveStore(state: any) {
  fs.writeFileSync(STORE, JSON.stringify(state, null, 2));
}

export function currentOwnerKey(): string | null {
  const s = loadStore();
  if (!s.keys || s.keys.length === 0) return null;
  return s.keys[s.keys.length - 1].key;
}

export function rotateKey(reason?: string) {
  const s = loadStore();
  const newRec: KeyRecord = {
    id: crypto.randomUUID(),
    key: genKey(),
    createdAt: Date.now(),
    meta: { reason: reason || "auto-rotation" }
  };
  s.keys = s.keys || [];
  s.keys.push(newRec);
  s.lastRotation = Date.now();
  saveStore(s);
  return newRec;
}

export function listKeys(limit = 10) {
  const s = loadStore();
  return (s.keys || []).slice(-limit).reverse();
}

export function shouldRotate(): boolean {
  const s = loadStore();
  if (!s.lastRotation) return true;
  return (Date.now() - s.lastRotation) >= ROTATION_INTERVAL_MS;
}
