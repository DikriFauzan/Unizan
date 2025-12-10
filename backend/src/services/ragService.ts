import { getEmbedding } from "./embeddingService";
import { addMemory, queryMemory } from "./memoryService";
import { hybridGenerate } from "./hybridRouter";

export async function ingestMemory(namespace:string, key:string, content:string, ttl?:number) {
  const emb = await getEmbedding(content: any);
  return addMemory(namespace, key, content, emb, ttl);
}

export async function retrieveAndGenerate(namespace:string, prompt:string, topK=5, apiKey?:string) {
  const emb = await getEmbedding(prompt: any);
  const hits = await queryMemory(namespace, emb, topK);
  // compose context
  const context = hits.map(h => `Memory (${h.key}): ${h.content}`).join("\n\n");
  const augmented = `${context}\n\nUser: ${prompt}\nAssistant:`;
  const resp = await hybridGenerate(augmented, apiKey);
  return { resp, hits };
}
