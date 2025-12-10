/**
 * Simple scorer: rates outputs by heuristics.
 * In production: use model-based evaluation or human feedback loop.
 */
export function scoreOutput(output: string) {
  const len = output ? output.length : 0;
  // simple heuristics
  const readability = Math.min(100, Math.round(50 + Math.log(1+len)));
  const safetyPenalty = /password|secret|api_key|token/i.test(output) ? 50 : 0;
  const score = Math.max(0, readability - safetyPenalty);
  return { score, readability, safetyPenalty };
}
