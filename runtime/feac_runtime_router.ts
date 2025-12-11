import { FEACRuntimeBinding } from "./feac_runtime_binding";
import { evaluateToken } from "./feac_token_policy";
import { writeAudit } from "./feac_audit";
import { ensureRotationIfNeeded } from "./feac_key_manager";
import { revokeKey, listRevoked } from "./feac_key_revoke";
import { listRotationLog } from "./feac_rotation_audit";
// Step 11 Imports
import { registerMemory, verifyMemory, listGuard } from "./feac_memory_guard";
import { scanAllMemory } from "./feac_memory_scanner";

const binding = new FEACRuntimeBinding();

// =============================
// STEP 10 ADMIN LAYER
// =============================
async function adminLayer(cmd: string, payload: any) {
  switch (cmd) {
    case "admin.rotate-now":
      return { status: "ok", result: ensureRotationIfNeeded("admin-forced") };

    case "admin.revoke-key":
      if (!payload?.keyId) return { status: "error", error: "missing keyId" };
      return { status: "ok", result: revokeKey(payload.keyId, { reason: payload.reason }) };

    case "admin.rotation-log":
      return { status: "ok", log: listRotationLog(50) };

    case "admin.revoked-keys":
      return { status: "ok", revoked: listRevoked() };

    default:
      return null;
  }
}

// =============================
// STEP 11 MEMORY LAYER
// =============================
async function adminMemoryLayer(cmd: string, payload: any) {
  switch (cmd) {
    case "admin.memory.scan":
      return { status: "ok", scan: scanAllMemory() };

    case "admin.memory.snapshot":
      return { status: "ok", list: listGuard() };

    case "admin.memory.register":
      if (!payload?.file) return { status: "error", error: "missing file" };
      return { status: "ok", record: registerMemory(payload.file) };

    case "admin.memory.verify":
       if (!payload?.file) return { status: "error", error: "missing file" };
       return { status: "ok", check: verifyMemory(payload.file) };

    default:
      return null;
  }
}

// =============================
// BASE ROUTER (SECURE HUB)
// =============================
export async function feacRoute(cmd: string, payload: any) {
  // 1. Cek Admin General (Step 10)
  const adminRes = await adminLayer(cmd, payload);
  if (adminRes) return adminRes;
  
  // 2. Cek Admin Memory (Step 11) - SECURED HERE
  const memoryRes = await adminMemoryLayer(cmd, payload);
  if (memoryRes) return memoryRes;

  // 3. Standard Commands
  switch (cmd) {
    case "superkey.exec":
    case "superkey.validate":
    case "superkey.meta":
      return await binding.send(cmd, payload);

    case "runtime.health":
      return { status: "ok", time: Date.now() };

    case "runtime.echo":
      return { status: "ok", echo: payload };

    default:
      return {
        status: "error",
        error: "Unknown command at router: " + cmd
      };
  }
}

// =============================
// POLICY WRAPPER (Step 8)
// =============================
export async function feacRouteWithPolicy(cmd: string, payload: any) {
  // 1. CEK TOKEN TERLEBIH DAHULU (Critical Security)
  const token = payload?.token || "";
  const policy = evaluateToken(token, cmd);

  writeAudit(cmd, token, policy.level, policy.allowed, policy.reason);

  if (!policy.allowed) {
    return {
      status: "denied",
      reason: policy.reason || "policy-blocked",
      level: policy.level
    };
  }

  // 2. Jika lolos Token, baru masuk ke Router (yang berisi Memory Layer)
  return await feacRoute(cmd, payload);
}
