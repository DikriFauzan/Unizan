import React, { useState } from "react";
import { Menu, Terminal, Shield, Cpu, Activity } from "lucide-react";

export default function App() {
  const [logs, setLogs] = useState(["[SYSTEM] Sovereign UI Connected.", "[CORE] Waiting for Neural Bus..."]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if(!input) return;
    setLogs(prev => [...prev, `[USER] ${input}`, `[AI] Processing command: ${input}...`]);
    setInput("");
  };

  return (
    <div style={{display:"flex", height:"100vh", width:"100vw"}}>
      {/* SIDEBAR */}
      <aside style={{width:260, background:"#202123", color:"#ECECF1", padding:10, display:"flex", flexDirection:"column"}}>
        <div style={{padding:10, fontWeight:"bold", display:"flex", alignItems:"center", gap:10}}>
          <Shield size={20} color="#10a37f"/> FEAC CORE
        </div>
        <nav style={{flex:1}}>
          <div style={{padding:10, borderRadius:5, background:"#343541", marginBottom:5, cursor:"pointer"}}>
            <Terminal size={16} style={{marginRight:8, display:"inline"}}/> Terminal Output
          </div>
          <div style={{padding:10, borderRadius:5, cursor:"pointer"}}>
            <Cpu size={16} style={{marginRight:8, display:"inline"}}/> Neural Bus
          </div>
          <div style={{padding:10, borderRadius:5, cursor:"pointer"}}>
            <Activity size={16} style={{marginRight:8, display:"inline"}}/> Financial Ledger
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main style={{flex:1, display:"flex", flexDirection:"column", background:"#343541", position:"relative"}}>
        <div style={{flex:1, padding:20, overflowY:"auto", color:"#D1D5DB", fontFamily:"monospace"}}>
          {logs.map((l,i) => (
            <div key={i} style={{marginBottom:8, borderBottom:"1px solid #444654", paddingBottom:8}}>{l}</div>
          ))}
        </div>
        <div style={{padding:20, background:"#343541", borderTop:"1px solid #555"}}>
           <div style={{display:"flex", background:"#40414F", borderRadius:8, padding:10}}>
             <input 
               style={{flex:1, background:"transparent", border:"none", color:"white", outline:"none"}}
               placeholder="Enter command to Sovereign Core..."
               value={input}
               onChange={e=>setInput(e.target.value)}
               onKeyDown={e=> e.key === 'Enter' && handleSend()}
             />
             <button onClick={handleSend} style={{background:"transparent", border:"none", cursor:"pointer", color:"#ccc"}}><Terminal size={18}/></button>
           </div>
        </div>
      </main>
    </div>
  );
}
