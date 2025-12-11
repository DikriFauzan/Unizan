import { feacRuntimeDispatch } from "./feac_runtime_main";

/**
 * FEAC Runtime Binding Layer
 * Menghubungkan command eksternal → dispatcher runtime internal.
 */
export class FEACRuntimeBinding {
  async send(cmd: string, payload: any = {}) {
    try {
      const result = await feacRuntimeDispatch(cmd, payload);
      return {
        status: "ok",
        cmd,
        payload,
        result
      };
    } catch (e: any) {
      return {
        status: "error",
        error: e.message || e.toString(),
        cmd,
        payload
      };
    }
  }
}
