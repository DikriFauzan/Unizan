/**
 * Retriever: accepts text query, obtains embedding, queries vector index, fetches context
 */
import { embedText } from "./embeddingsAdapter";
import { query as vquery } from "./vectorIndex";

export async function retrieveContext(queryText: string, topK = 5) {
  const vec = await embedText(queryText);
  const results = await vquery(vec, topK);
  // normalize metadata into context snippets
  const contexts = results.map((r:any) => ({ id: r.id, score: r.score, snippet: r.metadata?.text || r.metadata?.payload || "" }));
  return contexts;
}
