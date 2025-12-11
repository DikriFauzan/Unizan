import { SecurityAgent } from "./feac_agent_security";
import { RevenueAgent } from "./feac_agent_revenue";
import { FinancialAgent } from "./feac_agent_financial"; // NEW

const agents: any = {
  security: new SecurityAgent(),
  revenue: new RevenueAgent(),
  financial: new FinancialAgent(), // Registered
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

// Auto Start Essential Agents
agents.security.start();
agents.financial.start(); // Finance Minister on duty!
