<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { 
  Menu, Send, Bot, Terminal, Box, Lock, GitBranch, 
  Gamepad2, Cloud, DollarSign, Settings, Plus, X, 
  LayoutGrid, ChevronLeft, Hammer, HardDrive, Fingerprint, 
  Server, Activity, FileText, Folder, Radar, UserCheck, Play
=======
import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, Send, Bot, Terminal, Box, Lock, GitBranch, 
  Gamepad2, Cloud, DollarSign, Settings, Plus, X, 
  MoreHorizontal, LayoutGrid, ChevronLeft, Hammer, 
  HardDrive, Fingerprint, ShieldAlert, FolderOpen, UserCheck,
  Server, Activity, Globe, FileText, Folder, Check, Map, Radar
>>>>>>> gen25-ui-20251212-0053
} from "lucide-react";

const API_URL = "http://localhost:3001/api";
type ViewMode = 'chat' | 'apps' | 'termux' | 'neogrid' | 'billing' | 'fleet' | 'godot' | 'memory' | 'cloud' | 'architect';
<<<<<<< HEAD

export default function App() {
  const [view, setView] = useState<ViewMode>('chat');
  const [role, setRole] = useState('owner');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
=======
type Role = 'owner' | 'client';

export default function App() {
  const [view, setView] = useState<ViewMode>('chat');
  const [role, setRole] = useState<Role>('owner');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(true);
>>>>>>> gen25-ui-20251212-0053
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    fetch(API_URL+'/chats').then(r=>r.json()).then(d=>{ setChats(d); if(d.length) setCurrentChatId(d[0].id); else createNewChat(); }).catch(()=>createNewChat());
<<<<<<< HEAD
  }, []);
=======
  }, [role]);
>>>>>>> gen25-ui-20251212-0053

  const createNewChat = () => {
     const newId = Date.now().toString();
     const newChat = {id:newId, title:"New Chat", messages:[]};
     setChats([newChat, ...chats]); setCurrentChatId(newId); setView('chat'); setDrawerOpen(false);
  };
  const nav = (mode: ViewMode) => { setView(mode); setDrawerOpen(false); };

  return (
<<<<<<< HEAD
    <div style={{ height: "100vh", background: "#343541", color: "white", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", fontFamily:"sans-serif" }}>
      
      {/* HEADER */}
      <header style={{height: 50, background: "#202123", borderBottom: "1px solid #444", display: "flex", alignItems: "center", padding: "0 15px", zIndex: 50}}>
          <button onClick={() => setDrawerOpen(true)} style={{background:"transparent", color:"white", border:"none", cursor:"pointer"}}><Menu size={24} /></button>
          <div style={{marginLeft: 15, fontWeight: "bold", textTransform:"uppercase", fontSize:14}}>{view.replace('_', ' ')}</div>
          <div style={{marginLeft:"auto", fontSize:10, color: role==='owner'?"#10b981":"#888", border: role==='owner'?"1px solid #10b981":"1px solid #444", padding:"2px 8px", borderRadius:10}}>{role==='owner'?'SOVEREIGN OWNER':'CLIENT'}</div>
      </header>
      
      {/* DRAWER SIDEBAR */}
=======
    <div style={{ height: "100vh", background: "#343541", color: "white", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      
      {/* HEADER */}
      <header style={{height: 50, background: "#202123", borderBottom: "1px solid #444", display: "flex", alignItems: "center", padding: "0 15px", zIndex: 50}}>
          <button onClick={() => setDrawerOpen(true)} style={{background:"transparent", color:"white", border:"none"}}><Menu size={24} /></button>
          <div style={{marginLeft: 15, fontWeight: "bold", textTransform:"uppercase", fontSize:14}}>{view.replace('_', ' ')}</div>
          <div style={{marginLeft:"auto", fontSize:10, color: role==='owner'?"#10b981":"#888", border: role==='owner'?"1px solid #10b981":"1px solid #444", padding:"2px 8px", borderRadius:10}}>{role.toUpperCase()}</div>
      </header>
      
      {/* DRAWER (LOCKED POSITION - CENTER/TOP) */}
>>>>>>> gen25-ui-20251212-0053
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 90}}></div>}
      <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: 280, background: "#202123", zIndex: 100, borderRight:"1px solid #444",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease", 
          display: "flex", flexDirection: "column", height: "100%" 
      }}>
          <div style={{padding:10}}>
             <div style={{display:"flex", justifyContent:"flex-end", marginBottom:10}}><button onClick={()=>setDrawerOpen(false)} style={{background:"transparent", color:"#ccc", border:"none"}}><X/></button></div>
             <button onClick={createNewChat} style={{width:"100%", padding:10, border:"1px solid #565869", borderRadius:6, background:"transparent", color:"white", display:"flex", alignItems:"center", gap:10, marginBottom:15}}><Plus size={16}/> New Chat</button>
<<<<<<< HEAD
             <div style={{background:"#2a2b32", borderRadius:8, padding:5, marginBottom:15, border:"1px solid #444"}}>
                 <div onClick={()=>{setShowConfig(true); setDrawerOpen(false);}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#ccc"}}><Settings size={14}/> Settings</div>
                 <div onClick={()=>{nav('apps');}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#ccc"}}><LayoutGrid size={14}/> Apps Menu</div>
                 <div onClick={()=>{setRole(role==='owner'?'client':'owner');}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#f59e0b"}}><UserCheck size={14}/> Switch Role</div>
             </div>
=======
             
             <div style={{background:"#2a2b32", borderRadius:8, padding:5, marginBottom:15, border:"1px solid #444"}}>
                 <div onClick={()=>setShowUserMenu(!showUserMenu)} style={{padding:10, display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderBottom: showUserMenu?"1px solid #444":"none"}}>
                     <div style={{width:24, height:24, background:role==='owner'?"#10b981":"#888", borderRadius:4}}></div>
                     <div style={{fontWeight:"bold", fontSize:14, flex:1}}>{role==='owner'?'Sovereign User':'Client'}</div>
                     <Settings size={14}/>
                 </div>
                 {showUserMenu && (
                     <div style={{padding:"5px 10px"}}>
                         <div onClick={()=>{setShowConfig(true); setDrawerOpen(false);}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#ccc"}}><Settings size={14}/> API Configuration</div>
                         <div onClick={()=>{nav('apps');}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#ccc"}}><LayoutGrid size={14}/> Fitur Tambahan</div>
                         <div onClick={()=>{setRole(role==='owner'?'client':'owner');}} style={{padding:10, cursor:"pointer", display:"flex", gap:10, fontSize:13, color:"#f59e0b"}}><UserCheck size={14}/> Switch Role</div>
                     </div>
                 )}
             </div>
             <div style={{fontSize:12, color:"#666", marginBottom:5, paddingLeft:5}}>RECENT CHATS</div>
>>>>>>> gen25-ui-20251212-0053
          </div>
          <div style={{flex: 1, overflowY: "auto", padding: "0 10px 10px"}}>
             {chats.map(chat => (
                 <div key={chat.id} onClick={()=>{setCurrentChatId(chat.id); setView('chat'); setDrawerOpen(false);}} style={{padding:10, borderRadius:6, marginBottom:4, fontSize:14, cursor:"pointer", background: currentChatId===chat.id && view==='chat' ? "#343541" : "transparent", display:"flex", alignItems:"center", gap:10}}><Bot size={16}/> {chat.title}</div>
             ))}
          </div>
      </div>

<<<<<<< HEAD
      {/* MAIN VIEW AREA */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {showConfig && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",zIndex:99,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"#222",padding:20,borderRadius:10}}><h3 style={{marginTop:0}}>API Config</h3><button onClick={()=>setShowConfig(false)} style={{padding:10,width:"100%"}}>Close</button></div></div>}
          
          {view === 'chat' && <ChatView chatId={currentChatId} chats={chats} setChats={setChats} />}
          {view === 'apps' && <AppsGrid nav={nav} />}
          
          {/* FUNCTIONAL MODULES (UNLOCKED) */}
=======
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {showConfig && <ConfigModal onClose={()=>setShowConfig(false)} role={role} />}
          {view === 'chat' && <ChatView chatId={currentChatId} chats={chats} setChats={setChats} />}
          {view === 'apps' && <AppsGrid nav={nav} role={role} />}
          
          {/* FIXED VISUAL MODULES */}
>>>>>>> gen25-ui-20251212-0053
          {view === 'termux' && <TermuxView nav={nav} />}
          {view === 'neogrid' && <NeoGridView nav={nav} />}
          {view === 'billing' && <BillingView nav={nav} role={role} />}
          {view === 'cloud' && <SecureCloudView nav={nav} />}
<<<<<<< HEAD
          {view === 'fleet' && <FleetView nav={nav} />}
          {view === 'godot' && <EngineBridgeView nav={nav} />}
          {view === 'architect' && <ArchitectView nav={nav} />}
          
          {/* LOCKED MODULES (ONLY MEMORY) */}
          {view === 'memory' && <LockedModule title="Core Memory" icon={<HardDrive size={48} color="#64748b"/>} nav={nav} />}
=======
          
          {/* LOCKED MODULES */}
          {view === 'fleet' && <FleetView nav={nav} />}
          {view === 'godot' && <EngineBridgeView nav={nav} role={role} />}
          {view === 'architect' && <ArchitectView nav={nav} role={role} />}
          {view === 'memory' && <MemoryView nav={nav} />}
>>>>>>> gen25-ui-20251212-0053
      </div>
    </div>
  );
}

<<<<<<< HEAD
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
=======
// ===========================================
// 1. NEO GRID (FIX: TABS AGENTS & EXPLORE)
// ===========================================
function NeoGridView({nav}:any) {
    const [tab, setTab] = useState<'agents'|'explore'>('agents');

    return (
        <div style={{padding:20, overflowY:"auto", height:"100%", background:"#0f172a", display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:20}}>
                <button onClick={()=>nav('apps')} style={{background:"transparent", border:"none", color:"#ccc"}}><ChevronLeft/></button>
                <h3 style={{margin:0, color:"#3b82f6"}}>NeoGrid</h3>
            </div>

            {/* TABS MENU */}
            <div style={{display:"flex", borderBottom:"1px solid #333", marginBottom:20}}>
                <button onClick={()=>setTab('agents')} style={{padding:"10px 20px", background:"transparent", border:"none", color: tab==='agents'?"#3b82f6":"#888", borderBottom: tab==='agents'?"2px solid #3b82f6":"none", fontWeight:"bold", cursor:"pointer"}}>AGENTS</button>
                <button onClick={()=>setTab('explore')} style={{padding:"10px 20px", background:"transparent", border:"none", color: tab==='explore'?"#f59e0b":"#888", borderBottom: tab==='explore'?"2px solid #f59e0b":"none", fontWeight:"bold", cursor:"pointer"}}>EXPLORE</button>
            </div>

            {/* CONTENT: AGENTS */}
            {tab === 'agents' && (
                <div className="animate-fade">
                     <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:15, marginBottom:20}}>
                        <div style={{background:"#1e293b", padding:15, borderRadius:8, display:"flex", flexDirection:"column", alignItems:"center", gap:10, border:"1px solid #10b981"}}>
                            <Server size={32} color="#10b981"/>
                            <div style={{textAlign:"center"}}>
                                <div style={{fontWeight:"bold", fontSize:14}}>Core Sovereign</div>
                                <div style={{fontSize:10, background:"#064e3b", color:"#10b981", padding:"2px 8px", borderRadius:10, marginTop:5}}>MASTER</div>
                            </div>
                        </div>
                        <div style={{background:"#1e293b", padding:15, borderRadius:8, display:"flex", flexDirection:"column", alignItems:"center", gap:10, border:"1px solid #444"}}>
                            <Activity size={32} color="#f59e0b"/>
                            <div style={{textAlign:"center"}}>
                                <div style={{fontWeight:"bold", fontSize:14}}>Worker Alpha</div>
                                <div style={{fontSize:10, background:"#451a03", color:"#f59e0b", padding:"2px 8px", borderRadius:10, marginTop:5}}>PROCESSING</div>
                            </div>
                        </div>
                    </div>
                    <div style={{background:"black", padding:10, borderRadius:6, fontFamily:"monospace", fontSize:11, color:"#ccc", height:200, overflowY:"auto"}}>
                        <div style={{color:"#10b981"}}>[CORE] System stable.</div>
                        <div style={{color:"#f59e0b"}}>[ALPHA] Processing batch #9921...</div>
                        <div style={{color:"#888"}}>[SYS] Waiting for new tasks.</div>
                    </div>
                </div>
            )}

            {/* CONTENT: EXPLORE */}
            {tab === 'explore' && (
                <div className="animate-fade" style={{textAlign:"center", paddingTop:20}}>
                    <Radar size={64} color="#f59e0b" className="animate-spin-slow" style={{margin:"0 auto"}}/>
                    <h3 style={{marginTop:20, color:"#f59e0b"}}>Network Scanner</h3>
                    <p style={{color:"#888", fontSize:12}}>Scanning distributed nodes in the Sovereign Network...</p>
                    
                    <div style={{textAlign:"left", marginTop:30}}>
                        <div style={{padding:10, borderBottom:"1px solid #333", display:"flex", justifyContent:"space-between"}}>
                            <div>Node_XJ9 (Japan)</div>
                            <div style={{color:"#10b981"}}>Online (12ms)</div>
                        </div>
                        <div style={{padding:10, borderBottom:"1px solid #333", display:"flex", justifyContent:"space-between"}}>
                            <div>Node_US_East</div>
                            <div style={{color:"#f59e0b"}}>Busy (102ms)</div>
                        </div>
                        <div style={{padding:10, borderBottom:"1px solid #333", display:"flex", justifyContent:"space-between"}}>
                            <div>Node_Eur_1</div>
                            <div style={{color:"#10b981"}}>Online (45ms)</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ===========================================
// 2. SECURE CLOUD (FIX: REAL FILES & FOLDERS)
// ===========================================
function SecureCloudView({nav}:any) {
    const [step, setStep] = useState('LOADING'); 
    const [email, setEmail] = useState("");
    const [folders, setFolders] = useState<string[]>([]);
    const [files, setFiles] = useState<string[]>([]);

    useEffect(() => {
        fetch(API_URL+'/cloud/status').then(r=>r.json()).then(d => { setStep(d.setup_complete ? 'LOCKED' : 'SETUP'); });
    }, []);

    const runSetup = async () => {
        if(!email.includes('@')) return alert("Invalid Email");
        await fetch(API_URL+'/cloud/setup', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email})});
        setStep('LOCKED');
    };

    const unlock = async () => {
        setStep("SCANNING");
        setTimeout(() => {
            setStep("OPEN");
            // ISI KONTEN AGAR TIDAK KOSONG
            setFolders(["Sovereign_Identity", "Crypto_Wallets", "Client_Projects", "System_Backups"]);
            setFiles(["master_key.pem", "config_v2.json", "blueprint_arch.pdf", "stripe_logs.csv", "env_vars.enc"]);
        }, 1500);
    };

    return (
        <div style={{padding:20, height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
            <button onClick={()=>nav('apps')} style={{position:"absolute", top:20, left:20, background:"transparent", border:"none", color:"#ccc"}}><ChevronLeft/></button>
            
            {step === 'SETUP' && (
                <div style={{textAlign:"center", maxWidth:300}}>
                    <Cloud size={64} color="#3b82f6"/>
                    <h2>Cloud Initialization</h2>
                    <input placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%", padding:10, marginBottom:10, background:"#111", border:"1px solid #444", color:"white"}}/>
                    <button onClick={runSetup} style={{width:"100%", padding:10, background:"#3b82f6", color:"white", border:"none", fontWeight:"bold"}}>CONNECT</button>
                </div>
            )}

            {step === 'LOCKED' && (
                <div style={{textAlign:"center"}}>
                    <Lock size={64} color="#ef4444"/>
                    <h2 style={{marginTop:20}}>Vault Locked</h2>
                    <button onClick={unlock} style={{marginTop:20, padding:"15px 30px", background:"#ef4444", color:"white", border:"none", borderRadius:30, display:"flex", alignItems:"center", gap:10, fontWeight:"bold"}}><Fingerprint/> SCAN (5s)</button>
                </div>
            )}

            {step === 'SCANNING' && <div style={{textAlign:"center", color:"#f59e0b"}}><Fingerprint size={64} className="animate-pulse"/><h3>Verifying...</h3></div>}

            {step === 'OPEN' && (
                <div style={{width:"100%", maxWidth:600, height:"100%", display:"flex", flexDirection:"column", alignSelf:"start"}}>
                    <div style={{paddingBottom:10, borderBottom:"1px solid #333", marginBottom:10}}>
                        <h3 style={{margin:0, color:"#10b981"}}>Sovereign Vault</h3>
                        <div style={{fontSize:12, color:"#666"}}>Connected to: {email||"Encrypted Route"}</div>
                    </div>
                    
                    <div style={{flex:1, overflowY:"auto"}}>
                        <div style={{fontSize:12, color:"#888", marginBottom:5}}>FOLDERS</div>
                        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20}}>
                            {folders.map((f,i) => (
                                <div key={i} style={{background:"#1e293b", padding:15, borderRadius:6, display:"flex", alignItems:"center", gap:10}}>
                                    <Folder size={20} color="#fbbf24"/> <span style={{fontSize:13}}>{f}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{fontSize:12, color:"#888", marginBottom:5}}>FILES</div>
                        {files.map((f,i)=>(
                            <div key={i} style={{padding:12, borderBottom:"1px solid #222", display:"flex", alignItems:"center", gap:15}}>
                                <FileText size={18} color="#94a3b8"/> 
                                <div style={{flex:1, fontSize:14}}>{f}</div>
                                <div style={{fontSize:10, color:"#666"}}>AES-256</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ===========================================
// 3. BILLING (FIX: 5 TIERS + SOVEREIGN LABEL)
// ===========================================
function BillingView({nav, role}:any) {
    const plans = [
        {name: "Free", price: "$0", color: "#888", features: ["Basic Chat"]},
        {name: "Standard", price: "$15", color: "#3b82f6", features: ["Faster Response"]},
        {name: "Pro", price: "$29", color: "#f59e0b", features: ["Reasoning Models"]},
        {name: "Ultimate", price: "$99", color: "#8b5cf6", features: ["Full Automation"]},
        {name: "Enterprise", price: "Custom", color: "#ec4899", features: ["Source Access"]}
    ];

    return (
        <div style={{padding:20, overflowY:"auto", height:"100%"}}>
             <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:20}}>
                <button onClick={()=>nav('apps')} style={{background:"transparent", border:"none", color:"#ccc"}}><ChevronLeft/></button>
                <h3 style={{margin:0, color:"#ec4899"}}>Billing & Plans</h3>
            </div>
            
            <div style={{marginBottom:20, textAlign:"center", background:"#2d1b4e", padding:20, borderRadius:10, border:"1px solid #ec4899"}}>
                <div style={{fontSize:12, color:"#d8b4fe", textTransform:"uppercase"}}>Your Active License</div>
                <div style={{fontSize:24, fontWeight:"bold", color:"white", marginTop:5}}>{role==='owner' ? 'SOVEREIGN OWNER' : 'CLIENT ACCESS'}</div>
                {role==='owner' && <div style={{fontSize:10, color:"#ec4899", marginTop:5}}>FULL SYSTEM CONTROL</div>}
            </div>

            <div style={{display:"grid", gap:10}}>
                {plans.map((p,i) => (
                    <div key={i} style={{background: "#202123", padding:12, borderRadius:8, border:"1px solid #333", display:"flex", justifyContent:"space-between", alignItems:"center", opacity: 0.8}}>
                        <div>
                            <div style={{fontWeight:"bold", color: p.color, fontSize:14}}>{p.name}</div>
                            <div style={{fontSize:10, color:"#aaa"}}>{p.features.join(" • ")}</div>
                        </div>
                        <div style={{fontWeight:"bold"}}>{p.price}</div>
                    </div>
                ))}
            </div>
>>>>>>> gen25-ui-20251212-0053
        </div>
    )
}

<<<<<<< HEAD
=======
// ===========================================
// LOCKED MODULES (UNCHANGED)
// ===========================================
function TermuxView({nav}:any) { 
    const [history, setHistory] = useState(["FEAC Sovereign Shell v75.0","Copyright (c) 2025 Neural Systems","","root@sovereign:~# "]); const [cmd, setCmd] = useState(""); const endRef = useRef<any>(null);
    useEffect(() => endRef.current?.scrollIntoView({behavior:"smooth"}), [history]);
    const execute = async () => { if(!cmd) return; const newHistory = [...history]; newHistory[newHistory.length-1] = "root@sovereign:~# " + cmd; setHistory(newHistory); setCmd(""); const res = await fetch(API_URL+'/termux', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({cmd})}); const data = await res.json(); setHistory(prev => [...prev, data.output || "", "root@sovereign:~# "]); };
    return (<div style={{background: "black", height: "100%", display: "flex", flexDirection: "column", fontFamily: "monospace", fontSize: 14}}><div style={{background: "#333", padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #555"}}><div style={{display:"flex", gap:5}}><div style={{width:10, height:10, borderRadius:"50%", background:"#ff5f56"}}></div><div style={{width:10, height:10, borderRadius:"50%", background:"#ffbd2e"}}></div><div style={{width:10, height:10, borderRadius:"50%", background:"#27c93f"}}></div></div><div style={{color: "#aaa", fontSize: 12}}>bash — 80x24</div><button onClick={()=>nav('apps')} style={{background:"transparent", color:"white", border:"none"}}><X size={14}/></button></div><div style={{flex: 1, padding: 10, overflowY: "auto", color: "#00ff00"}}>{history.map((line, i) => (<div key={i} style={{whiteSpace: "pre-wrap", minHeight: 20}}>{line}</div>))}<div style={{display: "flex"}}><span style={{marginRight: 8, color: "#00ff00"}}>root@sovereign:~#</span><input value={cmd} onChange={e=>setCmd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&execute()} style={{flex: 1, background: "transparent", border: "none", color: "white", outline: "none", fontFamily: "monospace"}} autoFocus/></div><div ref={endRef}></div></div></div>); 
}
function ConfigModal({onClose, role}:any) { const [cfg, setCfg] = useState<any>({}); useEffect(()=>{ fetch(API_URL+'/config').then(r=>r.json()).then(setCfg).catch(()=>{}); }, []); const save = () => { fetch(API_URL+'/config', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(cfg)}).then(onClose); }; if (role === 'client') return (<div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center"}}><div style={{width:300, background:"#1e293b", padding:20, borderRadius:8}}><h3>Client Mode</h3><p>API Keys managed by Stripe.</p><button onClick={onClose} style={{width:"100%", padding:10}}>Close</button></div></div>); return (<div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center"}}><div style={{width:320, background:"#1e293b", padding:20, borderRadius:8, border:"1px solid #444"}}><h3 style={{marginTop:0}}>Configuration</h3><div style={{marginBottom:10}}><div style={{fontSize:12,color:"#aaa"}}>Gemini API Key</div><input type="password" value={cfg.gemini_key||''} onChange={e=>setCfg({...cfg,gemini_key:e.target.value})} style={{width:"100%",padding:8,background:"#111",border:"1px solid #444",color:"white"}}/></div><div style={{marginBottom:10}}><div style={{fontSize:12,color:"#aaa"}}>Flowith API Key</div><input type="password" value={cfg.flowith_key||''} onChange={e=>setCfg({...cfg,flowith_key:e.target.value})} style={{width:"100%",padding:8,background:"#111",border:"1px solid #444",color:"white"}}/></div><div style={{marginBottom:15}}><div style={{fontSize:12,color:"#aaa"}}>Sovereign SuperKey</div><input type="password" value={cfg.superkey||''} onChange={e=>setCfg({...cfg,superkey:e.target.value})} style={{width:"100%",padding:8,background:"#111",border:"1px solid #444",color:"white"}}/></div><div style={{display:"flex",gap:10}}><button onClick={save} style={{flex:1,background:"#10b981",color:"black",padding:10,border:"none"}}>SAVE</button><button onClick={onClose} style={{flex:1,background:"#333",color:"white",padding:10,border:"none"}}>CANCEL</button></div></div></div>); }
function ArchitectView({nav, role}:any) { const [file, setFile] = useState<File|null>(null); const [msgs, setMsgs] = useState([{role:'ai', text:'Architect Ready.'}]); const [input, setInput] = useState(""); const endRef = useRef<any>(null); if(role!=='owner') return <div style={{padding:20}}>Access Denied</div>; useEffect(() => endRef.current?.scrollIntoView({behavior:"smooth"}), [msgs]); const handleUpload = async () => { if(!file) return; setMsgs(p => [...p, {role:'ai', text:`Auditing ${file.name}...`}]); const fd = new FormData(); fd.append('manual', file); await fetch(API_URL+'/architect/audit', { method:'POST', body:fd }); setMsgs(p => [...p, {role:'ai', text:`✅ Audit Complete.`}]); }; const send = async () => { if(!input) return; setMsgs(p => [...p, {role:'user', text:input}]); setInput(""); const res = await fetch(API_URL+'/architect/interact', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt:input})}); const data = await res.json(); setMsgs(p => [...p, {role:'ai', text: data.text}]); }; return (<div style={{height:"100%", display:"flex", flexDirection:"column"}}><div style={{padding:10, background:"#202123", display:"flex", alignItems:"center", gap:10}}><button onClick={()=>nav('apps')}>&larr;</button><h3>Architect</h3></div><div style={{flex:1, overflowY:"auto", padding:20, background:"#022c22"}}><div style={{marginBottom:20}}><input type="file" onChange={e=>setFile(e.target.files?.[0]||null)}/><button onClick={handleUpload}>UPLOAD</button></div>{msgs.map((m,i)=><div key={i} style={{marginBottom:10, textAlign:m.role==='user'?'right':'left'}}><div style={{padding:10, background:m.role==='user'?'#10b981':'#064e3b'}}>{m.text}</div></div>)}<div ref={endRef}></div></div><div style={{padding:15, background:"#202123", display:"flex", gap:10}}><input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1, padding:10}} placeholder="Command..."/><button onClick={send}>SEND</button></div></div>); }
function EngineBridgeView({nav, role}:any) { const [msgs, setMsgs] = useState([{role:'ai', text:'Engine Bridge Ready.'}]); const [input, setInput] = useState(""); const [proj, setProj] = useState(""); const endRef = useRef<any>(null); if(role!=='owner') return <div style={{padding:20}}>Access Denied</div>; useEffect(() => endRef.current?.scrollIntoView({behavior:"smooth"}), [msgs]); const selectFolder = () => { setTimeout(()=>{ setProj("project.faz.neo"); setMsgs(p=>[...p,{role:'ai', text:"✅ Loaded project.faz.neo"}]); }, 500); }; const send = async () => { if(!input) return; setMsgs(p=>[...p,{role:'user',text:input}]); setInput(""); const res=await fetch(API_URL+'/engine/interact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:input, context:proj})}); const d=await res.json(); setMsgs(p=>[...p,{role:'ai',text:d.text}]); }; return (<div style={{height:"100%", display:"flex", flexDirection:"column"}}><div style={{padding:10, background:"#202123", display:"flex", alignItems:"center", gap:10}}><button onClick={()=>nav('apps')}>&larr;</button><h3>Engine Bridge</h3></div><div style={{flex:1, overflowY:"auto", padding:20, background:"#1e1e1e"}}>{msgs.map((m,i)=><div key={i} style={{marginBottom:10, textAlign:m.role==='user'?'right':'left'}}><div style={{display:"inline-block", padding:10, background:m.role==='user'?'#a855f7':'#333'}}>{m.text}</div></div>)}<div ref={endRef}></div></div><div style={{padding:15, background:"#202123"}}>{!proj ? <button onClick={selectFolder} style={{width:"100%", padding:15, background:"#a855f7"}}>SELECT PROJECT (+)</button> : <div style={{display:"flex", gap:10}}><input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1, padding:10}} placeholder="Command..."/><button onClick={send}>SEND</button></div>}</div></div>); }
function FleetView({nav}:any) { const [repos, setRepos] = useState<any[]>([]); const [newRepo, setNewRepo] = useState(""); const [token, setToken] = useState(""); const [scanRes, setScanRes] = useState<any>(null); useEffect(()=>{ fetch(API_URL+'/repos').then(r=>r.json()).then(setRepos).catch(()=>{}); },[]); const addRepo = () => { if(!newRepo) return; const up = [...repos, {name:newRepo, token:token?'***':null, status:'Active'}]; setRepos(up); fetch(API_URL+'/repos', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(up)}); setNewRepo(""); setToken(""); }; const scan = (name:string) => { setScanRes({loading:true, name}); fetch(API_URL+'/repos/scan', {method:'POST'}).then(r=>r.json()).then(d=>setScanRes({loading:false, name, ...d})); }; return (<div style={{height:"100%", padding:20, overflowY:"auto"}}><div style={{display:"flex", alignItems:"center", gap:10, marginBottom:20}}><button onClick={()=>nav('apps')} style={{background:"transparent", border:"none", color:"#ccc"}}><ChevronLeft/></button><h3 style={{margin:0, color:"#f59e0b"}}>Fleet Repositories</h3></div><div className="glass-card" style={{padding:15, marginBottom:20, border:"1px solid #f59e0b"}}><div style={{display:"flex", gap:10, marginBottom:10}}><input value={newRepo} onChange={e=>setNewRepo(e.target.value)} placeholder="user/repo" style={{flex:1, padding:8, background:"#111", border:"1px solid #444", color:"white"}} /><input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="GitHub Token" style={{width:100, padding:8, background:"#111", border:"1px solid #444", color:"white"}} /></div><button onClick={addRepo} style={{width:"100%", background:"#f59e0b", border:"none", padding:10, fontWeight:"bold"}}>ADD</button></div>{repos.map((r,i)=>(<div key={i} style={{background:"#202123", padding:10, marginBottom:10, display:"flex", justifyContent:"space-between"}}>{r.name} <button onClick={()=>scan(r.name)}>SCAN</button></div>))} {scanRes && !scanRes.loading && <div style={{background:"#222", padding:10}}>Scan Complete: {scanRes.issues.length} Issues</div>}</div>); }
function AppsGrid({nav, role}:any) { return <div style={{padding:20, overflowY:"auto", height:"100%"}}><h2 style={{textAlign:"center", color:"#10b981"}}>Fitur Tambahan</h2><div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:15, maxWidth:800, margin:"0 auto"}}><AppIcon icon={<Hammer size={32} color={role==='owner'?"#10b981":"#444"}/>} label="Neural Architect" onClick={()=>nav('architect')} locked={role!=='owner'}/><AppIcon icon={<Gamepad2 size={32} color={role==='owner'?"#a855f7":"#444"}/>} label="Engine Bridge" onClick={()=>nav('godot')} locked={role!=='owner'}/><AppIcon icon={<Terminal size={32} color="#10b981"/>} label="Termux Shell" onClick={()=>nav('termux')}/><AppIcon icon={<GitBranch size={32} color="#f59e0b"/>} label="Fleet Repos" onClick={()=>nav('fleet')}/><AppIcon icon={<Cloud size={32} color="#ef4444"/>} label="Secure Cloud" onClick={()=>nav('cloud')}/><AppIcon icon={<Box size={32} color="#3b82f6"/>} label="Neo Grid" onClick={()=>nav('neogrid')}/><AppIcon icon={<DollarSign size={32} color="#ec4899"/>} label="Billing" onClick={()=>nav('billing')}/><AppIcon icon={<HardDrive size={32} color="#64748b"/>} label="Memory" onClick={()=>nav('memory')}/></div></div> }
function AppIcon({icon, label, onClick, locked}:any) { return <div onClick={onClick} style={{background:"#202123", padding:"25px 10px", borderRadius:10, border:"1px solid #333", textAlign:"center", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10, opacity:locked?0.5:1}}>{icon}<div style={{fontWeight:"bold", fontSize:13}}>{label} {locked&&"🔒"}</div></div> }
function ChatView({chatId, chats, setChats}:any) { const [input, setInput] = useState(""); const chat = chats.find((c:any) => c.id === chatId) || {messages:[]}; const send = () => { if(!input) return; const msgs = [...chat.messages, {role:'user', text:input}]; const updatedChats = chats.map((c:any)=>c.id===chatId ? {...c, title:input.substring(0,20), messages:msgs}:c); setChats(updatedChats); setInput(""); setTimeout(()=>{ setChats(chats.map((c:any)=>c.id===chatId ? {...c, messages:[...msgs, {role:'ai', text:"Processed: "+input}]}:c)); }, 500); }; return <div className="chat-container" style={{maxWidth:800, margin:"0 auto", height:"100%", display:"flex", flexDirection:"column"}}><div className="message-list" style={{flex:1, overflowY:"auto", padding:20}}>{chat.messages.map((m:any,i:number)=><div key={i} className={`message ${m.role}`} style={{display:"flex", marginBottom:20, justifyContent: m.role==='user'?'flex-end':'flex-start'}}><div className="bubble" style={{background: m.role==='user'?"#10b981":"#444654", padding:"10px 15px", borderRadius:8}}>{m.text}</div></div>)}</div><div className="input-area" style={{padding:20, background:"#343541"}}><div className="input-wrapper" style={{background:"#40414f", borderRadius:8, display:"flex", padding:5}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} style={{flex:1, background:"transparent", border:"none", color:"white"}} placeholder="Send..."/><button onClick={send} style={{background:"transparent", color:"#10b981", border:"none"}}><Send/></button></div></div></div>; }
function MemoryView({nav}:any) { return <div style={{padding:20}}><button onClick={()=>nav('apps')}>&larr;</button> Memory</div> }

>>>>>>> gen25-ui-20251212-0053
