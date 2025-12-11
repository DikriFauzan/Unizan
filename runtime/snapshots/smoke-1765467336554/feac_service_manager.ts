/**
 * feac_service_manager.ts
 * Service registry & lifecycle manager:
 * - register services (local / remote)
 * - periodic healthchecks
 * - graceful shutdown hooks
 */

type ServiceKind = "local" | "superkey" | "other";

export interface ServiceDesc {
  id: string;
  kind: ServiceKind;
  endpoint?: string; // optional for remote services
  meta?: Record<string, any>;
  lastSeen?: number;
}

const services: Record<string, ServiceDesc> = {};

export function registerService(s: ServiceDesc) {
  services[s.id] = { ...s, lastSeen: Date.now() };
}

export function deregisterService(id: string) {
  delete services[id];
}

export function listServices() {
  return Object.values(services);
}

export function touchService(id: string) {
  if (services[id]) services[id].lastSeen = Date.now();
}

export function serviceHealthReport() {
  const now = Date.now();
  return Object.values(services).map(s => ({
    id: s.id, kind: s.kind, healthy: (now - (s.lastSeen || 0)) < 60_000, meta: s.meta || {}
  }));
}

// graceful shutdown helper
export async function shutdownAll() {
  // placeholder: call cleanup handlers if any
  return { ok: true, time: Date.now() };
}
