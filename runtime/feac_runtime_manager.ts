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
