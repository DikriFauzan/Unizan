import { FEACRuntimeBinding } from "./feac_runtime_binding";
import { evaluateToken } from "./feac_token_policy";
import { writeAudit } from "./feac_audit";
import { ensureRotationIfNeeded } from "./feac_key_manager";
import { revokeKey, listRevoked } from "./feac_key_revoke";
import { listRotationLog } from "./feac_rotation_audit";

const binding = new FEACRuntimeBinding();

// --- ADMIN LAYER (STEP 10) ---
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
      return null; // Not an admin command
  }
}

// --- BASE ROUTER (STEP 6 + 10) ---
export async function feacRoute(command: string, payload: any) {
  // 1. Cek Admin Command dulu
  const adminRes = await adminLayer(command, payload);
  if (adminRes) return adminRes;

  // 2. Standard Commands
  switch (command) {
    case "superkey.exec":
    case "superkey.validate":
    case "superkey.meta":
      return await binding.send(command, payload);

    case "runtime.health":
      return { status: "ok", time: Date.now() };

    case "runtime.echo":
      return { status: "ok", echo: payload };

    default:
      return {
        status: "error",
        error: "Unknown command at router: " + command
      };
  }
}

// --- POLICY WRAPPER (STEP 8) ---
export async function feacRouteWithPolicy(cmd: string, payload: any) {
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

  // Forward to base router
  return await feacRoute(cmd, payload);
}
