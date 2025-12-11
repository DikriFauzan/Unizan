import { SuperKeyBridge, UCIEnvelope } from '../integration/superkey_bridge';

export class FEACRuntimeBridge {
  private bridge: SuperKeyBridge;

  constructor(url: string, token: string) {
    this.bridge = new SuperKeyBridge(url, token);
  }

  async call(cmd: string, args: any[], meta: any = {}): Promise<any> {
    const env: UCIEnvelope = {
      uci: { cmd, args, meta },
      signature: null
    };

    return await this.bridge.executeUCI(env);
  }
}
