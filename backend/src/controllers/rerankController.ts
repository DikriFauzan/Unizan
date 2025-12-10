import { Request, Response } from "express";
import { rerankCandidates } from "../services/rerankerService";
import { composeContext } from "../services/contextComposer";
import { getEmbedding } from "../services/embeddingService";
import { queryMemory } from "../services/memoryService";

export async function rerankHandler(req:Request, res:Response) {
  try {
    const { namespace="global", prompt, topK=10, useCross=false } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });
    // get candidate pool (fetch more than topK to rerank)
    const pool = await queryMemory(namespace, await getEmbedding(prompt), Math.max(50, topK*5));
    const reranked = await rerankCandidates(pool, prompt, useCross);
    return res.json({ ok:true, reranked: reranked.slice(0, topK) });
  } catch(e:any) { return res.status(500).json({ error: e.message }); }
}

export async function composeHandler(req:Request, res:Response) {
  try {
    const { prompt, hits } = req.body;
    if (!prompt || !Array.isArray(hits)) return res.status(400).json({ error: "prompt & hits required" });
    const { context, metadata } = composeContext(hits, prompt);
    return res.json({ ok:true, context, metadata });
  } catch(e:any) { return res.status(500).json({ error: e.message }); }
}
