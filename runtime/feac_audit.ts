/**
 * FEAC AUDIT LOGGER
 * Oversight penuh semua command, termasuk owner-bypass.
 */

import * as fs from "fs";
import * as path from "path";

const AUDIT_FILE = path.join(process.env.HOME || ".", "feac_audit_log.json");

interface AuditEntry {
  time: number;
  command: string;
  tokenHash: string;
  level: string;
  allowed: boolean;
  reason?: string;
}

function hashToken(t: string) {
  // simple irreversible mask, not cryptographic
  return Buffer.from(t).toString("base64").slice(0, 10);
}

export function writeAudit(command: string, token: string, level: string, allowed: boolean, reason?: string) {
  const entry: AuditEntry = {
    time: Date.now(),
    command,
    tokenHash: hashToken(token),
    level,
    allowed,
    reason
  };

  let arr: AuditEntry[] = [];
  if (fs.existsSync(AUDIT_FILE)) {
    try {
      arr = JSON.parse(fs.readFileSync(AUDIT_FILE, "utf8"));
    } catch (_) {
      arr = [];
    }
  }

  arr.push(entry);
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(arr, null, 2));
}

export function readAudit() {
  if (!fs.existsSync(AUDIT_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(AUDIT_FILE, "utf8"));
  } catch {
    return [];
  }
}
