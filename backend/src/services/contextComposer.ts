/**
 * composeContext:
 * - receives reranked hits (array) and user prompt
 * - assembles context respecting token budget (approximate using char length)
 * - returns { contextString, metadata }
 *
 * Note: tokenization approx via characters; for production use tokenizer libs.
 */

const MAX_CHARS = parseInt(process.env.RAG_CHAR_BUDGET || "2500");

export function composeContext(hits:any[], prompt:string) {
  // Prefer high compositeScore first, include headings
  let included = [];
  let chars = 0;
  for (const h of hits) {
    const frag = `--- Memory: ${h.key} (score:${(h.compositeScore||0).toFixed(3)})\n${h.content}\n\n`;
    if (chars + frag.length > MAX_CHARS) continue;
    included.push(frag);
    chars += frag.length;
    if (chars > MAX_CHARS) break;
  }
  const context = included.join("") + `\nUser: ${prompt}\nAssistant:`;
  return { context, metadata: { includedCount: included.length, charBudget: MAX_CHARS, usedChars: chars } };
}
