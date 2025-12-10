/**
 * Vector index interface
 * Methods: upsert(id, vector, metadata), query(vector, topK), delete(id)
 *
 * This module attempts to load provider based on ENV VECTOR_PROVIDER.
 * - If no provider, uses local flat-file (inefficient) as fallback.
 */
import fs from "fs";
import path from "path";

const provider = process.env.VECTOR_PROVIDER || "local";
const storageFile = path.resolve("./vector_index_store.json");

type IndexItem = { id: string; vector: number[]; metadata?: any; ts:number };

let localIndex: IndexItem[] = [];
if (fs.existsSync(storageFile)) {
  try { localIndex = JSON.parse(fs.readFileSync(storageFile, "utf8")); } catch(e){}
}

function persistLocal() {
  try { fs.writeFileSync(storageFile, JSON.stringify(localIndex)); } catch(e){}
}

export async function upsert(id:string, vector:number[], metadata?:any) {
  if (provider !== "local") {
    try { const impl = require(`../integrations/vector_${provider}`).default; return impl.upsert(id, vector, metadata); } catch(e){}
  }
  // local fallback
  const existing = localIndex.find(i => i.id === id);
  if (existing) { existing.vector = vector; existing.metadata = metadata; existing.ts = Date.now(); }
  else localIndex.push({ id, vector, metadata, ts: Date.now() });
  persistLocal();
  return { ok:true };
}

function cosine(a:number[], b:number[]) {
  let da = 0, db = 0, dot = 0;
  for (let i=0;i<a.length;i++){ dot += (a[i]||0)*(b[i]||0); da += (a[i]||0)*(a[i]||0); db += (b[i]||0)*(b[i]||0); }
  if (da===0 || db===0) return 0;
  return dot / (Math.sqrt(da)*Math.sqrt(db));
}

export async function query(vector:number[], topK=5) {
  if (provider !== "local") {
    try { const impl = require(`../integrations/vector_${provider}`).default; return impl.query(vector, topK); } catch(e){}
  }
  const scored = localIndex.map(i => ({ id:i.id, score:cosine(vector, i.vector), metadata:i.metadata }));
  scored.sort((a,b) => b.score - a.score);
  return scored.slice(0, topK);
}

export async function remove(id:string) {
  if (provider !== "local") {
    try { const impl = require(`../integrations/vector_${provider}`).default; return impl.delete(id); } catch(e){}
  }
  localIndex = localIndex.filter(i => i.id !== id);
  persistLocal();
  return { ok:true };
}
