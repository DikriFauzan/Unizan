import { FEACRuntimeBinding } from "./feac_runtime_binding";
import { evaluateToken } from "./feac_token_policy";
import { writeAudit } from "./feac_audit";
import { ensureRotationIfNeeded } from "./feac_key_manager";
import { revokeKey, listRevoked } from "./feac_key_revoke";
import { listRotationLog } from "./feac_rotation_audit";
import { registerMemory, verifyMemory, listGuard } from "./feac_memory_guard";
import { scanAllMemory } from "./feac_memory_scanner";
// Snapshot Modules
import { createSnapshot, listSnapshots } from "./feac_snapshot";
import { loadSnapshot } from "./feac_snapshot_loader";
import { snapshotRoute } from "./feac_snapshot_router"; // Step 13
import * as path from "path";

const binding = new FEACRuntimeBinding();

// --- ADMIN LAYERS ---
async function adminLayer(cmd: string, payload: any) {
  switch (cmd) {
    case "admin.rotate-now": return { status: "ok", result: ensureRotationIfNeeded("admin-forced") };
    case "admin.revoke-key": return payload?.keyId ? { status: "ok", result: revokeKey(payload.keyId, { reason: payload.reason }) } : { error: "missing keyId" };
    case "admin.rotation-log": return { status: "ok", log: listRotationLog(50) };
    case "admin.revoked-keys": return { status: "ok", revoked: listRevoked() };
    default: return null;
  }
}

async function adminMemoryLayer(cmd: string, payload: any) {
  switch (cmd) {
    case "admin.memory.scan": return { status: "ok", scan: scanAllMemory() };
    case "admin.memory.snapshot": return { status: "ok", list: listGuard() };
    case "admin.memory.register": return payload?.file ? { status: "ok", record: registerMemory(payload.file) } : { error: "missing file" };
    case "admin.memory.verify": return payload?.file ? { status: "ok", check: verifyMemory(payload.file) } : { error: "missing file" };
    default: return null;
  }
}

// --- MAIN ROUTER ---
export async function feacRoute(cmd: string, payload: any) {
  // 1. Admin Checks
  if (await adminLayer(cmd, payload)) return await adminLayer(cmd, payload);
  if (await adminMemoryLayer(cmd, payload)) return await adminMemoryLayer(cmd, payload);

  // 2. Snapshot Logic (Step 13)
  if (cmd.startsWith("snapshot.") || cmd.startsWith("admin.snapshot.")) {
    const snapRes = await snapshotRoute(cmd, payload);
    if (snapRes) return snapRes;
  }

  // 3. Standard Commands
  switch (cmd) {
    case "superkey.exec":
    case "superkey.validate":
    case "superkey.meta": return await binding.send(cmd, payload);
    case "runtime.health": return { status: "ok", time: Date.now() };
    case "runtime.echo": return { status: "ok", echo: payload };
    default: return { status: "error", error: "Unknown command: " + cmd };
  }
}

// --- POLICY ENGINE ---
export async function feacRouteWithPolicy(cmd: string, payload: any) {
  const token = payload?.token || "";
  const policy = evaluateToken(token, cmd);
  writeAudit(cmd, token, policy.level, policy.allowed, policy.reason);
  if (!policy.allowed) {
    return { status: "denied", reason: policy.reason || "policy-blocked", level: policy.level };
  }
  return await feacRoute(cmd, payload);
}
