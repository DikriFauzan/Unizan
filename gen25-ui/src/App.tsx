import React, { useState, useEffect } from "react";
import { 
  Menu, Send, Bot, Terminal, Box, Lock, GitBranch, 
  Gamepad2, Cloud, DollarSign, Settings, Plus, X, 
  LayoutGrid, ChevronLeft, Hammer, HardDrive, Fingerprint, 
  Server, Activity, FileText, Folder, Radar, UserCheck, Play
} from "lucide-react";

const API_URL = "http://localhost:3001/api";
type ViewMode = 'chat' | 'apps' | 'termux' | 'neogrid' | 'billing' | 'fleet' | 'godot' | 'memory' | 'cloud' | 'architect';

export default function App() {
  const [view, setView] = useState<ViewMode>('chat');
  const [role, setRole] = useState('owner');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    fetch(API_URL+'/chats').then(r=>r.json()).then(d=>{ setChats(d); if(d.length) setCurrentChatId(d[0].id); else createNewChat(); }).catch(()=>createNewChat());
  }, []);

  const createNewChat = () => {
     const newId = Date.now().toString();
     const newChat = {id:newId, title:"New Chat", messages:[]};
     setChats([newChat, ...chats]); setCurrentChatId(newId); setView('chat'); setDrawerOpen(false);
  };
  const nav = (mode: ViewMode) => { setView(mode); setDrawerOpen(false); };

  return (
    <div style={{ height: "100vh", background: "#343541", color: "white", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", fontFamily:"sans-serif" }}>
      
      {/* HEADER */}
      <header style={{height: 50, background: "#202123", borderBottom: "1px solid #444", display: "flex", alignItems: "center", padding: "0 15px", zIndex: 50}}>
          <button onClick={() => setDrawerOpen(true)} style={{background:"transparent", color:"white", border:"none", cursor:"pointer"}}><Menu size={24} /></button>
          <div style={{marginLeft: 15, fontWeight: "bold", textTransform:"uppercase", fontSize:14}}>{view.replace('_', ' ')}</div>
          <div style={{marginLeft:"auto", fontSize:10, color: role==='owner'?"#10b981":"#888", border: role==='owner'?"1px solid #10b981":"1px solid #444", padding:"2px 8px", borderRadius:10}}>{role==='owner'?'SOVEREIGN OWNER':'CLIENT'}</div>
      </header>
      
      {/* DRAWER SIDEBAR */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 90}}></div>}
      <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: 280, background: "#202123", zIndex: 100, borderRight:"1px solid #444",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease", 
          display: "flex", flexDirection: "column", height: "100%" 
      }}>
          <div style={{padding:10}}>
             <div style={{display:"flex", justifyContent:"flex-end", marginBottom:10}}><button onClick={()=>setDrawerOpen(false)} style={{background:"transparent", color:"#ccc", border:"none"}}><X/></button></div>
             <button onClick={createNewChat} style={{width:"100%", padding:10, border:"1px solid #565869", borderRadius:6, background:"transparent", color:"white", display:"flex", alignItems:"center", gap:10, marginBottom:15}}><Plus size={16}/> New Chat</button>
             <div style={{background:"#2a2b32", borderRadius:8, padding:5, marginBottom:15, border:"1px solid #444"}}>
                 <div onClick={()=>{setShowConfig(true); setDrawerOpen(false);}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#ccc"}}><Settings size={14}/> Settings</div>
                 <div onClick={()=>{nav('apps');}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#ccc"}}><LayoutGrid size={14}/> Apps Menu</div>
                 <div onClick={()=>{setRole(role==='owner'?'client':'owner');}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#f59e0b"}}><UserCheck size={14}/> Switch Role</div>
             </div>
          </div>
          <div style={{flex: 1, overflowY: "auto", padding: "0 10px 10px"}}>
             {chats.map(chat => (
                 <div key={chat.id} onClick={()=>{setCurrentChatId(chat.id); setView('chat'); setDrawerOpen(false);}} style={{padding:10, borderRadius:6, marginBottom:4, fontSize:14, cursor:"pointer", background: currentChatId===chat.id && view==='chat' ? "#343541" : "transparent", display:"flex", alignItems:"center", gap:10}}><Bot size={16}/> {chat.title}</div>
             ))}
          </div>
      </div>

      {/* MAIN VIEW AREA */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {showConfig && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",zIndex:99,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"#222",padding:20,borderRadius:10}}><h3 style={{marginTop:0}}>API Config</h3><button onClick={()=>setShowConfig(false)} style={{padding:10,width:"100%"}}>Close</button></div></div>}
          
          {view === 'chat' && <ChatView chatId={currentChatId} chats={chats} setChats={setChats} />}
          {view === 'apps' && <AppsGrid nav={nav} />}
          
          {/* FUNCTIONAL MODULES (UNLOCKED) */}
          {view === 'termux' && <TermuxView nav={nav} />}
          {view === 'neogrid' && <NeoGridView nav={nav} />}
          {view === 'billing' && <BillingView nav={nav} role={role} />}
          {view === 'cloud' && <SecureCloudView nav={nav} />}
          {view === 'fleet' && <FleetView nav={nav} />}
          {view === 'godot' && <EngineBridgeView nav={nav} />}
          {view === 'architect' && <ArchitectView nav={nav} />}
          
          {/* LOCKED MODULES (ONLY MEMORY) */}
          {view === 'memory' && <LockedModule title="Core Memory" icon={<HardDrive size={48} color="#64748b"/>} nav={nav} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. NEURAL ARCHITECT (UNLOCKED)
// ----------------------------------------------------
function ArchitectView({nav}:any) {
    const [logs, setLogs] = useState<string[]>([]);
    const [file, setFile] = useState<File|null>(null);

    const handleUpload = () => {
        if(!file) return;
        setLogs(prev => [...prev, `[AUDIT] Analyzing: ${file.name}`, `[AI] Detected Pattern: Monolithic`, `[AI] Recommendation: Split to Microservices`]);
    };

    return (
        <div style={{height:"100%", display:"flex", flexDirection:"column"}}>
            <div style={{padding:15, background:"#202123", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #333"}}>
                <button onClick={()=>nav('apps')} style={{background:"transparent", border:"none", color:"#ccc", cursor:"pointer"}}><ChevronLeft/></button>
                <h3 style={{margin:0, color:"#10b981"}}>Neural Architect</h3>
            </div>
            <div style={{flex:1, padding:20, overflowY:"auto"}}>
                <div style={{background:"#111", padding:20, borderRadius:8, border:"1px dashed #444", textAlign:"center", marginBottom:20}}>
                    <div style={{marginBottom:10, fontWeight:"bold"}}>Upload Source Code / Diagram</div>
                    <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} style={{color:"white"}}/>
                    <br/>
                    <button onClick={handleUpload} style={{marginTop:15, padding:"8px 20px", background:"#10b981", border:"none", borderRadius:4, fontWeight:"bold", cursor:"pointer", color:"black"}}>START AUDIT</button>
                </div>
                <div style={{fontFamily:"monospace", fontSize:13, background:"#000", padding:10, borderRadius:6}}>
                    <div style={{color:"#10b981"}}>System Ready...</div>
                    {logs.map((l,i)=><div key={i} style={{marginTop:5, color:"#ccc"}}>{l}</div>)}
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------
// 2. ENGINE BRIDGE (UNLOCKED)
// ----------------------------------------------------
function EngineBridgeView({nav}:any) {
    const [active, setActive] = useState(false);
    return (
        <div style={{height:"100%", display:"flex", flexDirection:"column"}}>
            <div style={{padding:15, background:"#202123", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #333"}}>
                <button onClick={()=>nav('apps')} style={{background:"transparent", border:"none", color:"#ccc", cursor:"pointer"}}><ChevronLeft/></button>
                <h3 style={{margin:0, color:"#a855f7"}}>Godot Engine Bridge</h3>
            </div>
            <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20}}>
                {!active ? (
                    <div style={{textAlign:"center"}}>
                        <Gamepad2 size={64} color="#a855f7" style={{marginBottom:20}}/>
                        <button onClick={()=>setActive(true)} style={{padding:"15px 30px", background:"#a855f7", color:"white", border:"none", borderRadius:8, fontWeight:"bold", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", gap:10}}>
                            <Play fill="white" size={16}/> CONNECT ENGINE
                        </button>
                    </div>
                ) : (
                    <div style={{width:"100%", height:"100%", background:"#111", borderRadius:8, border:"1px solid #a855f7", padding:10}}>
                        <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                            <span style={{color:"#a855f7", fontWeight:"bold"}}>Project: FAZ_NEO_RPG</span>
                            <span style={{color:"#10b981"}}>● LIVE SYNC</span>
                        </div>
                        <div style={{height:"80%", background:"black", display:"flex", alignItems:"center", justifyContent:"center", color:"#555"}}>
                            [ GODOT VIEWPORT STREAM ]
                        </div>
                        <div style={{marginTop:10, fontSize:12, fontFamily:"monospace"}}>
                            {">"} Assets Loaded: 142<br/>
                            {">"} Physics: 60 FPS
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ----------------------------------------------------
// 3. FLEET REPOS (UNLOCKED)
// ----------------------------------------------------
function FleetView({nav}:any) {
    const [repos, setRepos] = useState(["sovereign-core", "neural-ui", "termux-bridge"]);
    const [input, setInput] = useState("");

    const addRepo = () => {
        if(!input) return;
        setRepos([...repos, input]);
        setInput("");
    }

    return (
        <div style={{height:"100%", display:"flex", flexDirection:"column"}}>
             <div style={{padding:15, background:"#202123", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #333"}}>
                <button onClick={()=>nav('apps')} style={{background:"transparent", border:"none", color:"#ccc", cursor:"pointer"}}><ChevronLeft/></button>
                <h3 style={{margin:0, color:"#f59e0b"}}>Fleet Manager</h3>
            </div>
            <div style={{padding:20}}>
                <div style={{display:"flex", gap:10, marginBottom:20}}>
                    <input placeholder="github_user/repo_name" value={input} onChange={e=>setInput(e.target.value)} style={{flex:1, padding:10, background:"#111", border:"1px solid #444", color:"white"}}/>
                    <button onClick={addRepo} style={{padding:"0 20px", background:"#f59e0b", color:"black", fontWeight:"bold", border:"none", cursor:"pointer"}}>ADD</button>
                </div>
                <div style={{display:"flex", flexDirection:"column", gap:10}}>
                    {repos.map((r,i)=>(
                        <div key={i} style={{background:"#202123", padding:15, borderRadius:6, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                            <div style={{display:"flex", alignItems:"center", gap:10}}>
                                <GitBranch size={16} color="#888"/>
                                <span>{r}</span>
                            </div>
                            <div style={{fontSize:11, background:"#064e3b", color:"#10b981", padding:"2px 6px", borderRadius:4}}>ACTIVE</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------
// 4. APPS GRID (MENU UTAMA)
// ----------------------------------------------------
function AppsGrid({nav}:any) { 
    return (
        <div style={{padding:20, overflowY:"auto", height:"100%"}}>
            <h2 style={{textAlign:"center", color:"#10b981", marginBottom:30}}>Apps Menu</h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:15, maxWidth:800, margin:"0 auto"}}>
                {/* UNLOCKED MODULES */}
                <AppIcon icon={<Hammer size={32} color="#10b981"/>} label="Neural Architect" onClick={()=>nav('architect')} />
                <AppIcon icon={<Gamepad2 size={32} color="#a855f7"/>} label="Engine Bridge" onClick={()=>nav('godot')} />
                <AppIcon icon={<GitBranch size={32} color="#f59e0b"/>} label="Fleet Repos" onClick={()=>nav('fleet')} />
                
                {/* CORE MODULES */}
                <AppIcon icon={<Terminal size={32} color="#10b981"/>} label="Termux Shell" onClick={()=>nav('termux')}/>
                <AppIcon icon={<Cloud size={32} color="#ef4444"/>} label="Secure Cloud" onClick={()=>nav('cloud')}/>
                <AppIcon icon={<Box size={32} color="#3b82f6"/>} label="Neo Grid" onClick={()=>nav('neogrid')}/>
                <AppIcon icon={<DollarSign size={32} color="#ec4899"/>} label="Billing" onClick={()=>nav('billing')}/>
                
                {/* LOCKED MODULES */}
                <AppIcon icon={<HardDrive size={32} color="#64748b"/>} label="Core Memory" onClick={()=>nav('memory')} locked={true}/>
            </div>
        </div> 
    ) 
}

function AppIcon({icon, label, onClick, locked}:any) { 
    return (
        <div onClick={onClick} style={{background:"#202123", padding:"25px 10px", borderRadius:10, border:"1px solid #333", textAlign:"center", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10, opacity:locked?0.5:1, transition:"0.2s"}}>
            {icon}
            <div style={{fontWeight:"bold", fontSize:13}}>{label} {locked&&"🔒"}</div>
        </div> 
    ) 
}

// ----------------------------------------------------
// 5. EXISTING MODULES
// ----------------------------------------------------

function BillingView({nav, role}:any) {
    const plans = [{name:"Free",price:"$0",color:"#888",features:["Basic"]},{name:"Standard",price:"$15",color:"#3b82f6",features:["Fast"]},{name:"Pro",price:"$29",color:"#f59e0b",features:["Reasoning"]},{name:"Ultimate",price:"$99",color:"#8b5cf6",features:["Auto"]},{name:"Enterprise",price:"Custom",color:"#ec4899",features:["Full"]}];
    return (<div style={{padding:20,overflowY:"auto",height:"100%"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><button onClick={()=>nav('apps')} style={{background:"transparent",border:"none",color:"#ccc"}}><ChevronLeft/></button><h3 style={{margin:0,color:"#ec4899"}}>Billing</h3></div><div style={{marginBottom:20,textAlign:"center",background:"#2d1b4e",padding:20,borderRadius:10,border:"1px solid #ec4899"}}><div style={{fontSize:12,color:"#d8b4fe"}}>LICENSE</div><div style={{fontSize:24,fontWeight:"bold",color:"white"}}>{role==='owner'?'SOVEREIGN OWNER':'CLIENT'}</div></div><div style={{display:"grid",gap:10}}>{plans.map((p,i)=>(<div key={i} style={{background:"#202123",padding:12,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:"bold",color:p.color}}>{p.name}</div></div><div style={{fontWeight:"bold"}}>{p.price}</div></div>))}</div></div>)
}

function SecureCloudView({nav}:any) {
    const [step,setStep]=useState('LOCKED');const [files,setFiles]=useState<string[]>([]);
    const unlock=()=>{setStep('SCAN');setTimeout(()=>{setStep('OPEN');setFiles(["Master.key","Wallet.dat","Project_A.zip"])},1000)};
    return (<div style={{padding:20,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><button onClick={()=>nav('apps')} style={{position:"absolute",top:20,left:20,background:"none",border:"none",color:"#ccc"}}><ChevronLeft/></button>{step==='LOCKED'?<div style={{textAlign:"center"}}><Lock size={64} color="#ef4444"/><br/><button onClick={unlock} style={{marginTop:20,padding:"10px 30px",background:"#ef4444",color:"white",border:"none",borderRadius:20}}>UNLOCK</button></div>:step==='SCAN'?<Fingerprint size={64} className="animate-pulse" color="#f59e0b"/>:<div style={{width:"100%"}}><h3 style={{color:"#10b981"}}>Vault Open</h3>{files.map((x,i)=><div key={i} style={{padding:10,borderBottom:"1px solid #333",display:"flex",gap:10}}><FileText size={16}/>{x}</div>)}</div>}</div>)
}

function NeoGridView({nav}:any) { return <div style={{padding:20}}><div style={{display:"flex",gap:10}}><button onClick={()=>nav('apps')} style={{background:"none",border:"none",color:"white"}}><ChevronLeft/></button><h3>NeoGrid</h3></div><div style={{marginTop:20,display:"grid",gap:10}}><div style={{padding:15,background:"#111",borderLeft:"3px solid #10b981"}}>Agent Core: Online</div><div style={{padding:15,background:"#111",borderLeft:"3px solid #f59e0b"}}>Scanner: Idle</div></div></div> }

function TermuxView({nav}:any) { return <div style={{background: "black", height: "100%", padding: 10, fontFamily: "monospace"}}><div style={{color:"#0f0"}}>root@sovereign:~# _</div><button onClick={()=>nav('apps')} style={{marginTop:20,background:"#333",color:"white",border:"none",padding:5}}>EXIT</button></div>}

function ChatView({chatId, chats, setChats}:any) { 
    const [input,setInput]=useState("");
    const send=()=>{if(!input)return; setChats(chats.map((c:any)=>c.id===chatId?{...c,messages:[...c.messages||[],{role:'user',text:input},{role:'ai',text:"OK"}]}:c)); setInput("");};
    return <div style={{display:"flex",flexDirection:"column",height:"100%"}}><div style={{flex:1,padding:20}}>{(chats.find((c:any)=>c.id===chatId)?.messages||[]).map((m:any,i:number)=><div key={i} style={{marginBottom:10,textAlign:m.role==='user'?'right':'left'}}><span style={{background:m.role==='user'?'#10b981':'#444',padding:"5px 10px",borderRadius:5}}>{m.text}</span></div>)}</div><div style={{padding:10,background:"#333",display:"flex"}}><input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1,padding:10}} placeholder="Message..."/><button onClick={send}>Send</button></div></div> 
}

// 6. LOCKED MODULE COMPONENT
function LockedModule({title, icon, nav}:any) {
    return (
        <div style={{height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
            <button onClick={()=>nav('apps')} style={{position:"absolute", top:20, left:20, background:"transparent", border:"none", color:"#ccc"}}><ChevronLeft/></button>
            {icon}
            <h2 style={{marginTop:20, color:"#ccc"}}>{title}</h2>
            <div style={{padding:"5px 15px", background:"#333", borderRadius:20, fontSize:12, marginTop:10}}>ACCESS RESTRICTED</div>
        </div>
    )
}

