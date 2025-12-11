import { feacRoute } from "./feac_runtime_router";

export interface DispatchOpts {
  timeout?: number;     // Standard baru
  timeoutMs?: number;   // Legacy support (untuk feac_runtime_manager)
  retries?: number;     // Legacy support
}

function timeoutPromise(promise: Promise<any>, ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("dispatch-timeout"));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Explicit Promise<any> agar tidak circular error
export async function dispatch(command: string, payload: any = {}, opts: DispatchOpts = {}): Promise<any> {
  // Gunakan timeout ATAU timeoutMs, default 10000ms
  const timeoutVal = opts.timeout ?? opts.timeoutMs ?? 10000;
  
  try {
    const p = feacRoute(command, payload);
    const res = await timeoutPromise(p, timeoutVal);
    return res;
  } catch (e: any) {
    return { status: "error", error: e.message || String(e) };
  }
}
