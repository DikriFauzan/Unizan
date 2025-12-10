import axios from "axios";
import { getEmbedding } from "./embeddingService";

/**
 * rerankCandidates:
 * - candidates: array of { id, key, content, score } from memoryService
 * - prompt: user prompt (string)
 *
 * Strategy:
 * 1) compute embedding similarity (dot cos) if embedding available
 * 2) optionally call cross-encoder reranker via Aries or external service (butuh riset lanjutan)
 * 3) combine original 'score' + embedding sim + optional cross-encoder score
 *
 * Returns candidates sorted desc with compositeScore field.
 */

function cosSim(a:number[], b:number[]) {
  const dot = a.reduce((s,x,i)=> s + x*(b[i]||0),0);
  const na = Math.sqrt(a.reduce((s,x)=> s + x*x,0));
  const nb = Math.sqrt(b.reduce((s,x)=> s + x*x,0));
  if (!na || !nb) return 0;
  return dot/(na*nb);
}

export async function rerankCandidates(candidates:any[], prompt:string, useCrossEncoder = false) {
  // compute prompt embedding
  let promptEmb:any = null;
  try { promptEmb = await getEmbedding(prompt); } catch(e){ promptEmb = null; }

  // add embedding similarity
  const withSim = await Promise.all(candidates.map(async (c) => {
    let sim = 0;
    if (promptEmb && c.vector) {
      try {
        const vec = JSON.parse(c.vector);
        sim = cosSim(vec, promptEmb);
      } catch(e) { sim = 0; }
    }
    return { ...c, embSim: sim, compositeScore: (c.score || 0) * 0.4 + sim * 0.6 };
  }));

  // optional: cross-encoder (neural reranker) via Aries / external endpoint
  if (useCrossEncoder) {
    try {
      const ARIES_RERANK = process.env.ARIES_URL ? `${process.env.ARIES_URL}/rerank` : null;
      if (ARIES_RERANK) {
        const r = await axios.post(ARIES_RERANK, { prompt, candidates: withSim.map(c=>({id:c.id, text:c.content})) }, { timeout:30000 });
        const scores = r.data.scores || [];
        // combine
        for (let i=0;i<withSim.length;i++){
          withSim[i].cross = scores[i] ?? 0;
          withSim[i].compositeScore = withSim[i].compositeScore*0.4 + (withSim[i].cross||0)*0.6;
        }
      }
    } catch(e) {
      console.warn("cross-encoder rerank failed:", e.message);
    }
  }

  withSim.sort((a,b)=> b.compositeScore - a.compositeScore);
  return withSim;
}
