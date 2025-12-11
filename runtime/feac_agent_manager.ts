import { SecurityAgent } from "./feac_agent_security";
import { RevenueAgent } from "./feac_agent_revenue";

// Registry Agen
const agents: any = {
  security: new SecurityAgent(),
  revenue: new RevenueAgent(),
  // Disini nanti tempat FinancialAgent (Stripe Replacement)
};

export function startAgent(name: string) {
  if (agents[name]) {
    agents[name].start();
    return { status: "ok", msg: `Agent ${name} started` };
  }
  return { status: "error", error: "Agent not found" };
}

export function stopAgent(name: string) {
  if (agents[name]) {
    agents[name].stop();
    return { status: "ok", msg: `Agent ${name} stopped` };
  }
  return { status: "error", error: "Agent not found" };
}

export function listAgents() {
  const status: any = {};
  for (const key in agents) {
    status[key] = agents[key].isRunning() ? "running" : "stopped";
  }
  return status;
}

// Auto Start Security on Boot (Proteksi Max)
agents.security.start();
