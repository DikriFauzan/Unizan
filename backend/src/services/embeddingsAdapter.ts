/**
 * Embeddings adapter (provider-agnostic)
 * Implement provider modules under ../integrations/embeddings_<provider>.ts
 * Providers should export: embed(text: string): Promise<number[]>
 *
 * This adapter attempts to load provider specified via ENV EMB_PROVIDER.
 * Supported values (example): pinecone, milvus, redisvector, local
 *
 * NOTE: Provider implementations are required separately. — butuh riset lanjutan
 */
import * as fs from "fs";

const provider = process.env.EMB_PROVIDER || "local";

let impl: any = null;
try {
  impl = require(`../integrations/embeddings_${provider}`).default;
} catch (e) {
  // fallback to local placeholder (random embeddings) — NOT for production
  impl = {
    embed: async (text: string) => {
      // deterministic-ish lightweight embedding placeholder
      const seed = text.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
      const vec = new Array(1536).fill(0).map((_, i) => Math.sin(seed + i) * 1e-3);
      return vec;
    }
  };
}

export async function embedText(text: string) {
  return impl.embed(text);
}
