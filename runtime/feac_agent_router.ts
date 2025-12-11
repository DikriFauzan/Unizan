import { startAgent, stopAgent, listAgents } from "./feac_agent_manager";

export async function agentRoute(cmd: string, payload: any) {
  switch (cmd) {
    case "agent.list":
      return { status: "ok", agents: listAgents() };
      
    case "agent.start":
      if (!payload?.name) return { status: "error", error: "missing name" };
      return startAgent(payload.name);

    case "agent.stop":
      if (!payload?.name) return { status: "error", error: "missing name" };
      return stopAgent(payload.name);

    default: return null;
  }
}
