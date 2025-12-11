import { FEACRuntimeBinding } from "./feac_runtime_binding";
import { evaluateToken } from "./feac_token_policy";
import { writeAudit } from "./feac_audit";
import { ensureRotationIfNeeded } from "./feac_key_manager";
import { revokeKey, listRevoked } from "./feac_key_revoke";
import { listRotationLog } from "./feac_rotation_audit";
import { registerMemory, verifyMemory, listGuard } from "./feac_memory_guard";
import { scanAllMemory } from "./feac_memory_scanner";
import { snapshotRoute } from "./feac_snapshot_router";
import { controlRoute } from "./feac_control_router"; 
import { agentRoute } from "./feac_agent_router";
import { financialRoute } from "./feac_financial_router";
import { storeRoute } from "./feac_store_router";
import { subscriptionRoute } from "./feac_subscription_router";
import { retentionRoute } from "./feac_retention_router";
import { notifyRoute } from "./feac_notify_router"; // Step 21

const binding = new FEACRuntimeBinding();

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

export async function feacRoute(cmd: string, payload: any): Promise<any> {
  // 1. Notify Layer (Step 21)
  if (cmd.startsWith("notify.") || cmd.startsWith("event.")) {
    const notRes = await notifyRoute(cmd, payload);
    if (notRes) return notRes;
  }

  // 2. Retention Layer (Step 20)
  if (cmd.startsWith("user.benefit") || cmd.startsWith("sub.resubscribe")) {
    const retRes = await retentionRoute(cmd, payload);
    if (retRes) return retRes;
  }

  // 3. Subscription & Offer Layer
  if (cmd.startsWith("sub.") || cmd.startsWith("offer.") || cmd.startsWith("user.")) {
    const subRes = await subscriptionRoute(cmd, payload);
    if (subRes) return subRes;
  }

  // 4. Store Layer
  if (cmd.startsWith("store.")) {
    const storeRes = await storeRoute(cmd, payload);
    if (storeRes) return storeRes;
  }

  // 5. Financial Layer
  if (cmd.startsWith("finance.")) {
    const finRes = await financialRoute(cmd, payload);
    if (finRes) return finRes;
  }

  // 6. Agent Swarm Layer
  if (cmd.startsWith("agent.")) {
    const agentRes = await agentRoute(cmd, payload);
    if (agentRes) return agentRes;
  }

  // 7. Control Layer
  const ctrl = await controlRoute(cmd, payload);
  if (ctrl) return ctrl;

  // 8. Snapshot Layer
  if (cmd.startsWith("snapshot.") || cmd.startsWith("admin.snapshot.")) {
    const snapRes = await snapshotRoute(cmd, payload);
    if (snapRes) return snapRes;
  }

  // 9. Admin & Memory Layers
  if (await adminLayer(cmd, payload)) return await adminLayer(cmd, payload);
  if (await adminMemoryLayer(cmd, payload)) return await adminMemoryLayer(cmd, payload);

  // 10. Standard Commands
  switch (cmd) {
    case "superkey.exec":
    case "superkey.validate":
    case "superkey.meta": return await binding.send(cmd, payload);
    case "runtime.health": return { status: "ok", time: Date.now() };
    case "runtime.echo": return { status: "ok", echo: payload };
    default: return { status: "error", error: "Unknown command: " + cmd };
  }
}

export async function feacRouteWithPolicy(cmd: string, payload: any): Promise<any> {
  const token = payload?.token || "";
  const policy = evaluateToken(token, cmd);
  writeAudit(cmd, token, policy.level, policy.allowed, policy.reason);
  if (!policy.allowed) {
    return { status: "denied", reason: policy.reason || "policy-blocked", level: policy.level };
  }
  return await feacRoute(cmd, payload);
}
