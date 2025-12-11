/**
 * FEAC SuperKey Registry
 */
import { SuperKeyBridge } from "../integration/superkey_bridge";

export interface SuperKeyRegistryConfig {
  url: string;
  token: string;
}

export class FEACSuperKeyRegistry {
  private bridge: SuperKeyBridge;

  constructor(cfg: SuperKeyRegistryConfig) {
    this.bridge = new SuperKeyBridge(cfg.url, cfg.token);
  }

  async execUCI(payload: any) {
    return await this.bridge.executeUCI(payload);
  }

  async validate() {
    return await this.bridge.executeUCI({
      uci: { cmd: "superkey.validate", args: [], meta: {} },
      signature: null
    });
  }

  async meta() {
    return await this.bridge.executeUCI({
      uci: { cmd: "superkey.meta", args: [], meta: {} },
      signature: null
    });
  }
}
