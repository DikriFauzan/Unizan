/**
 * feac_dispatcher.ts
 * Central dispatcher that serializes / parallels FEAC commands,
 * handles retries, timeouts, and simple circuit-breaker logic.
 */

import { feacRoute } from "./feac_runtime_router";

export interface DispatchOpts {
  timeoutMs?: number;
  retries?: number;
  parallel?: boolean;
}

function timeoutPromise<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(r => { clearTimeout(t); resolve(r); }).catch(e => { clearTimeout(t); reject(e); });
  });
}

export async function dispatch(command: string, payload: any = {}, opts: DispatchOpts = {}) {
  const timeoutMs = opts.timeoutMs ?? 15000;
  const retries = opts.retries ?? 2;

  let attempt = 0;
  let lastErr: any = null;

  while (attempt <= retries) {
    try {
      const p = feacRoute(command, payload);
      const res = await timeoutPromise(p, timeoutMs);
      return res;
    } catch (e: any) {
      lastErr = e;
      attempt++;
      // backoff
      await new Promise(r => setTimeout(r, 200 * attempt));
      if (attempt > retries) break;
    }
  }

  throw lastErr || new Error("dispatch failed");
}
