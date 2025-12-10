import React, { useState } from "react";
import api from "../api/client";

export default function RAGHitsPanel({ jobId, initialHits=[], onInsertContext }) {
  const [hits, setHits] = useState(initialHits);
  const [selected, setSelected] = useState(() => new Set(hits.map(h=>h.id)));

  function toggle(id) {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  }

  async function rerank(prompt) {
    const r = await api.post("/ai/rerank", { prompt, topK: 10 });
    setHits(r.data.reranked || []);
    setSelected(new Set((r.data.reranked||[]).map(h=>h.id)));
  }

  function insertSelected() {
    const chosen = hits.filter(h=> selected.has(h.id));
    if (onInsertContext) onInsertContext(chosen);
  }

  return (
    <div style={{padding:12, background:'#0c0c0c', color:'#fff', borderRadius:8, width:360}}>
      <h4>Memory Hits (RAG)</h4>
      <div style={{maxHeight:300, overflow:'auto'}}>
        {hits.length===0 && <div>No hits yet</div>}
        {hits.map(h=>(
          <div key={h.id} style={{display:'flex',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #222'}}>
            <input type="checkbox" checked={selected.has(h.id)} onChange={()=>toggle(h.id)} />
            <div style={{marginLeft:8, flex:1}}>
              <div style={{fontSize:12}}><strong>{h.key}</strong> <small>score: {(h.compositeScore||h.score||0).toFixed(3)}</small></div>
              <div style={{fontSize:12, color:'#ddd'}}>{h.content.slice(0,240)}{h.content.length>240?'…':''}</div>
            </div>
            <div style={{marginLeft:8}}>{h.status==='done'?'✅':'◻️'}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:8, display:'flex', gap:8}}>
        <button onClick={()=>rerank(promptForRerank())}>Rerank</button>
        <button onClick={insertSelected}>Insert into prompt</button>
      </div>
    </div>
  );

  function promptForRerank(){
    // read prompt from the chat input if accessible (simple fallback)
    return window.__FEAC_LAST_PROMPT__ || "";
  }
}
