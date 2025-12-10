import prisma from "../config/db";
import { encode } from "base64-arraybuffer";

export async function addMemory(namespace: string, key: string, content: string, vector: number[], ttl?: number) {
  // store vector as JSON string to keep implementation DB-agnostic
  const vec = JSON.stringify(vector);
  return prisma.memory.create({
    data: { namespace, key, content, vector: vec, ttl }
  });
}

export async function queryMemory(namespace: string, vector: number[], topK = 5) {
  // naive retrieval: fetch all in namespace and compute cosine (server-side)
  const rows = await prisma.memory.findMany({ where: { namespace } });
  const scores = rows.map(r => {
    try {
      const v = JSON.parse(r.vector);
      // cosine similarity
      const dot = v.reduce((s:number, x:number, i:number) => s + x * (vector[i] || 0), 0);
      const normA = Math.sqrt(v.reduce((s:number,x:number)=> s + x*x,0));
      const normB = Math.sqrt(vector.reduce((s:number,x:number)=> s + x*x,0));
      const sim = normA && normB ? dot / (normA * normB) : 0;
      return { row: r, score: sim };
    } catch (e) {
      return { row: r, score: 0 };
    }
  });
  scores.sort((a,b)=> b.score - a.score);
  return scores.slice(0, topK).map(s=> ({ id: s.row.id, key: s.row.key, content: s.row.content, score: s.score }));
}

export async function deleteMemory(id: string) {
  return prisma.memory.delete({ where: { id }});
}
