import { submitProposal, approveProposal, rejectProposal, listProposals } from "./feac_proposal";
import { learn, recall, listTopics } from "./feac_cortex";
import { startSentinel, stopSentinel } from "./feac_sentinel";

// FIX: Added ': Promise<any>' explicitly
export async function controlRoute(cmd: string, payload: any): Promise<any> {
  switch (cmd) {
    case "proposal.list": return { status: "ok", list: listProposals(payload?.status) };
    case "proposal.approve":
      if (!payload?.id) return { status: "error", error: "missing id" };
      return await approveProposal(payload.id);
    case "proposal.reject":
      if (!payload?.id) return { status: "error", error: "missing id" };
      return rejectProposal(payload.id);
    case "proposal.create":
      if (!payload?.cmd) return { status: "error", error: "missing cmd" };
      return submitProposal(payload.cmd, payload.payload || {}, payload.reason || "Manual submission");

    case "cortex.learn":
      if (!payload?.topic) return { status: "error", error: "missing topic" };
      return learn(payload.topic, payload.data, payload.tags);
    case "cortex.recall":
      if (!payload?.topic) return { status: "error", error: "missing topic" };
      return { status: "ok", data: recall(payload.topic, payload.limit) };
    case "cortex.meta": return { status: "ok", topics: listTopics() };

    case "sentinel.start": startSentinel(); return { status: "ok", msg: "Sentinel Active" };
    case "sentinel.stop": stopSentinel(); return { status: "ok", msg: "Sentinel Stopped" };

    default: return null;
  }
}
