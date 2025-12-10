import React, { useState, useEffect } from "react";
import api from "../api/client";

export default function ModelAdmin(){
  const [cfg, setCfg] = useState({ fallback:"openai,gemini", ownerPrefix: "FEAC-SVR-" });

  useEffect(()=>{ /*load via API if implemented*/ },[]);

  const save = async () => {
    // implement REST call to save settings on server or via environment management
    alert("Save endpoint not implemented — butuh riset lanjutan");
  };

  return (
    <div style={{padding:20}}>
      <h2>Model Admin</h2>
      <label>Fallback Order (comma):</label>
      <input value={cfg.fallback} onChange={e=>setCfg({...cfg,fallback:e.target.value})} style={{width:'100%'}}/>
      <label>Owner Key Prefix:</label>
      <input value={cfg.ownerPrefix} onChange={e=>setCfg({...cfg,ownerPrefix:e.target.value})} style={{width:'100%'}}/>
      <div style={{marginTop:12}}><button onClick={save}>Save</button></div>
    </div>
  );
}
