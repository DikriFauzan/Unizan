export interface UCIMessage {
  cmd: string;
  args: any[];
  meta: Record<string, any>;
}

export interface UCIEnvelope {
  uci: UCIMessage;
  signature: string | null;
}

export class SuperKeyBridge {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.token = token;
  }

  async executeUCI(uci: UCIEnvelope): Promise<any> {
    try {
      const url = `${this.baseUrl}/v1/uci/execute`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ uci })
      });

      if (!response.ok) {
        return {
          status: 'error',
          httpStatus: response.status,
          error: await response.text()
        };
      }

      return await response.json();
    } catch (e: any) {
      return {
        status: 'error',
        error: e.message || e.toString()
      };
    }
  }
}
