/**
 * Planner: transform high-level goals into plan steps
 * - uses lightweight heuristics here; production should use LLM + chain-of-thought
 * - returns array of { id, step, estimatedCost, metadata }
 *
 * NOTE: skeleton only — model-driven planning requires LLM bindings. — butuh riset lanjutan
 */
import { v4 as uuidv4 } from "uuid";

export function planFromPrompt(prompt: string, type = "build") {
  const steps = [];
  // trivial heuristic splitter
  if (type === "build") {
    steps.push("clone repo");
    steps.push("install deps");
    steps.push("run build");
    steps.push("collect artifacts");
    steps.push("upload artifacts");
  } else {
    steps.push("analyze prompt");
    steps.push("draft plan");
    steps.push("validate plan");
  }

  return steps.map((s, i) => ({
    id: uuidv4(),
    step: s,
    order: i,
    estimatedCost: Math.max(1, Math.round(10 + Math.random()*40)),
    status: "pending",
    createdAt: new Date()
  }));
}
