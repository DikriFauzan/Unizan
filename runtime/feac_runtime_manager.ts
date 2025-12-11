import * as crypto from "crypto"; // Fix missing crypto
import { dispatch } from "./feac_dispatcher";
import { registerService, listServices, serviceHealthReport, shutdownAll } from "./feac_service_manager";
import { feacRouteWithPolicy } from "./feac_runtime_router";
import { ensureRotationIfNeeded, getOwnerKeyMasked } from "./feac_key_manager";
import { writeRotationLog } from "./feac_rotation_audit";
import { currentOwnerKey } from "./feac_key_rotation";

// --- TASK MANAGER ---
export async function startTask(command: string, payload: any, opts: any = {}) {
  if (command.startsWith("superkey.")) {
    registerService({ id: "superkey-default", kind: "superkey", endpoint: process.env.SUPERKEY_URL || undefined, meta: {} });
  }
  // Gunakan dispatch biasa (dispatcher akan memanggil router)
  // Tapi untuk security, kita panggil via binding securedTask di bawah
  return await dispatch(command, payload, { timeoutMs: opts.timeoutMs ?? 20000, retries: opts.retries ?? 2 });
}

export async function securedTask(command: string, payload: any) {
  // Langsung panggil Router with Policy
  return await feacRouteWithPolicy(command, payload);
}

// --- MONITORING ---
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

// --- ROTATION & AUDIT (STEP 9 + 10) ---
const __oldKey = () => {
  const k = currentOwnerKey();
  return k ? k.slice(0, 12) + "..." : null;
};

export async function rotationTick() {
  // Versi Audited (Step 10)
  const before = __oldKey();
  
  try {
    const res = ensureRotationIfNeeded("scheduled-tick");
    
    // Hanya log jika benar-benar ada rotasi atau error
    if (res?.status === "rotated") {
       const after = __oldKey();
       writeRotationLog({
         id: crypto.randomUUID(),
         timestamp: Date.now(),
         oldKeyMasked: before,
         newKeyMasked: after,
         reason: "scheduler-tick-rotated"
       });
       console.log("[rotation] key rotated:", res.id);
    }
    return res;
  } catch (e: any) {
    console.warn("[rotation] failed:", e);
    return { status: "error", error: e.message };
  }
}
