/**
 * feac_runtime_manager.ts
 * High-level binding: exposes methods for Engine/Admin/Automation to start tasks,
 * route to SuperKey when relevant, and manage token-policy hooks.
 */

import { dispatch } from "./feac_dispatcher";
import { registerService, listServices, serviceHealthReport, shutdownAll } from "./feac_service_manager";

export async function startTask(command: string, payload: any, opts: any = {}) {
  // Simple policy: if command targets superkey.* route, mark service used
  if (command.startsWith("superkey.")) {
    registerService({ id: "superkey-default", kind: "superkey", endpoint: process.env.SUPERKEY_URL || undefined, meta: {} });
  }
  // call dispatcher with reasonable defaults
  return await dispatch(command, payload, { timeoutMs: opts.timeoutMs ?? 20000, retries: opts.retries ?? 2 });
}

export function runtimeStatus() {
  return {
    up: true,
    services: listServices(),
    health: serviceHealthReport()
  };
}

export async function runtimeShutdown() {
  const res = await shutdownAll();
  return res;
}

// AUTO-POLICY BIND (STEP 8)
import { feacRouteWithPolicy } from "./feac_runtime_router";
export async function securedTask(command: string, payload: any) {
  return await feacRouteWithPolicy(command, payload);
}

// AUTO-ROTATION-INJECT (STEP 9)
import { ensureRotationIfNeeded, getOwnerKeyMasked } from "./feac_key_manager";

/**
 * Call this periodically from manager start-up or via scheduler to
 * automatically rotate owner/service keys when due.
 */
export async function rotationTick() {
  try {
    const res = ensureRotationIfNeeded("scheduled-tick");
    if (res?.status === "rotated") {
      console.log("[rotation] key rotated:", res.id);
    }
  } catch (e) {
    console.warn("[rotation] failed:", e);
  }
}
// Optionally expose getOwnerKeyMasked for admin endpoints.
