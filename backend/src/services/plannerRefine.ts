/**
 * Planner refinement: given base plan and a query/prompt, retrieve relevant context
 * and annotate or reorder steps. Lightweight heuristic demonstration.
 */
import { retrieveContext } from "./retriever";
export async function refinePlan(prompt:string, basePlan:any[]) {
  const ctx = await retrieveContext(prompt, 6);
  // simple heuristic: if any context contains "android" and basePlan has "install deps", boost its priority
  const hasAndroid = ctx.some(c => /android|gradle|apk/i.test(c.snippet));
  const refined = basePlan.map(s => ({...s}));
  if (hasAndroid) {
    refined.sort((a,b) => (a.step.toLowerCase().includes("install") ? -1 : 1));
  }
  return { refined, ctx };
}
