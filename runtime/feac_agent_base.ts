export interface AgentResult {
  agentName: string;
  action: string;
  details: any;
  timestamp: number;
}

export abstract class BaseAgent {
  protected name: string;
  protected interval: NodeJS.Timeout | null = null;
  protected tickRate: number; // ms

  constructor(name: string, tickRateMs: number) {
    this.name = name;
    this.tickRate = tickRateMs;
  }

  abstract tick(): Promise<void>;

  start() {
    if (this.interval) return;
    console.log(`[SWARM] Agent ${this.name} STARTED.`);
    this.interval = setInterval(() => this.tick(), this.tickRate);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    console.log(`[SWARM] Agent ${this.name} STOPPED.`);
  }

  isRunning() {
    return this.interval !== null;
  }
}
