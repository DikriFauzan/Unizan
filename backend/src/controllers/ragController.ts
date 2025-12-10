import { Request, Response } from "express";
import { ingestMemory, retrieveAndGenerate } from "../services/ragService";

export async function addMemoryHandler(req:Request, res:Response) {
  try {
    const { namespace="global", key, content, ttl } = req.body;
    if (!key || !content) return res.status(400).json({ error: "key & content required" });
    const m = await ingestMemory(namespace, key, content, ttl);
    return res.json({ ok:true, memory: m });
  } catch (e:any) { return res.status(500).json({ error: e.message }); }
}

export async function ragGenerateHandler(req:Request, res:Response) {
  try {
    const { namespace="global", prompt, topK=5 } = req.body;
    const apiKey = req.headers["x-api-key"] as string | undefined;
    const r = await retrieveAndGenerate(namespace, prompt, topK, apiKey);
    return res.json({ ok:true, provider: r.resp.provider, text: r.resp.text, hits: r.hits });
  } catch (e:any) { return res.status(500).json({ error: e.message }); }
}
