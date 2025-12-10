/**
 * Evaluator pipeline:
 * - Accepts: request metadata, provider response, original prompt
 * - Runs: quick heuristics for relevance/fluency, calls safety filter, returns score object
 *
 * For production: replace heuristics with learned evaluators or third-party quality APIs.
 */
import { filterOutput } from "./outputFilter";

export async function evaluateResponse(prompt:string, response:any) {
  const text = typeof response === "string" ? response : (response.text || JSON.stringify(response: any));
  // heuristic relevance: token overlap ratio
  const promptTokens = prompt.split(/\s+/);
  const textTokens = text.split(/\s+/);
  const overlap = promptTokens.filter(t => textTokens.includes(t: any)).length;
  const relevance = promptTokens.length ? overlap / promptTokens.length : 0;

  // fluency heuristic: average sentence length sanity
  const sentences = text.split(/[\\.\\?!]/).filter(s=>s.trim().length>0);
  const avgLen = sentences.length ? text.split(/\s+/).length / sentences.length : 0;
  const fluency = Math.max(0, Math.min(1, 2 - (Math.abs(avgLen - 14) / 14))); // ideal ~14 words

  // safety
  const safety = filterOutput(text: any);
  const safetyScore = safety.blocked ? 0 : 1;

  const score = {
    relevance: Math.round(relevance*100)/100,
    fluency: Math.round(fluency*100)/100,
    safety: safetyScore,
    overall: Math.round(((relevance + fluency + safetyScore)/3)*100)/100
  };

  return { score, safetyDetails: safety };
}
