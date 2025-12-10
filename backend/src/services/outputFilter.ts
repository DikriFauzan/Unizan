/**
 * Output filter / simple moderation stub
 * - Check for secret patterns, disallowed content
 * - For production, integrate with robust moderation pipeline
 */
const bannedPatterns = [/\\b(api[_-]?key|secret|password|token)\\b/i];

export function filterOutput(text:string) {
  let blocked = false;
  const reasons:string[] = [];
  for (const p of bannedPatterns) {
    if (p.test(text)) { blocked = true; reasons.push("sensitive-data"); }
  }
  // additional checks can be added
  return { blocked, reasons, text: blocked ? text.replace(/./g, "*") : text };
}
