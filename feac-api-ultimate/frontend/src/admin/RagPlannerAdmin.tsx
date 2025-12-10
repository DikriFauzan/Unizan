import React, { useState } from "react";
import api from "../api/client";

export default function RagPlannerAdmin(){
  const [prompt, setPrompt] = useState("");
  const [res, setRes] = useState<any>(null);

  const run = async () => {
    const r = await api.post("/rag/plan", { prompt, type: "build" });
    setRes(r.data);
  };

  return (
    <div style={{padding:20}}>
      <h2>RAG Planner — Test</h2>
      <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} style={{width:"100%",height:120}} />
      <div style={{marginTop:8}}><button onClick={run}>Run</button></div>
      <pre style={{background:"#111", color:"#ddd", padding:12, marginTop:12}}>{JSON.stringify(res, null, 2)}</pre>
    </div>
  );
}
