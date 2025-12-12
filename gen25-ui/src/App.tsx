import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, Send, Bot, Terminal, Box, Lock, GitBranch, 
  Gamepad2, Cloud, DollarSign, Settings, Plus, X, 
  LayoutGrid, ChevronLeft, Hammer, HardDrive, 
  Fingerprint, ShieldAlert, FolderOpen, UserCheck, 
  Activity, Server, UploadCloud, FileText, Cpu, Globe, 
  CheckCircle, Play, RefreshCw, AlertTriangle, Scan, Code,
  MessageSquare, Bell, Check, XCircle
} from "lucide-react";

type ViewMode = 'aicore' | 'apps' | 'termux' | 'neogrid' | 'billing' | 'fleet' | 'godot' | 'memory' | 'cloud' | 'architect';
type Role = 'owner' | 'client';

export default function App() {
  const [view, setView] = useState<ViewMode>('aicore');
  const [role, setRole] = useState<Role>('owner');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [agentAlerts, setAgentAlerts] = useState(2); 

  const nav = (mode: ViewMode) => { setView(mode); setDrawerOpen(false); };

  return (
    <div style={{ height: "100vh", display:"flex", flexDirection:"column", position:"relative", background: "#0b1121", color: "white" }}>
      
      {/* HEADER BAR */}
      <header style={{height: 55, background: "#151e32", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", padding: "0 15px", zIndex: 50, justifyContent:"space-between"}}>
          <div style={{display:"flex", alignItems:"center", gap:15}}>
              <button onClick={() => setDrawerOpen(true)} style={{background:"transparent", color:"white", border:"none"}}><Menu size={24} /></button>
              <div>
                  <div style={{fontWeight: "bold", fontSize:14, color:"#10b981"}}>FEAC SOVEREIGN</div>
                  <div style={{fontSize:10, color:"#64748b", textTransform:"uppercase"}}>{view === 'aicore' ? 'NEURAL CORE' : view.toUpperCase()}</div>
              </div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:15}}>
              {agentAlerts > 0 && view !== 'aicore' && (
                  <div onClick={()=>nav('aicore')} style={{display:"flex", alignItems:"center", gap:5, cursor:"pointer", background:"rgba(245, 158, 11, 0.1)", padding:"4px 8px", borderRadius:20, border:"1px solid #f59e0b"}}>
                      <Bell size={12} color="#f59e0b" className="animate-pulse"/>
                      <span style={{fontSize:10, color:"#f59e0b", fontWeight:"bold"}}>{agentAlerts}</span>
                  </div>
              )}
              <div style={{fontSize:10, fontWeight:"bold", background: role==='owner'?"#064e3b":"#333", border: role==='owner'?"1px solid #10b981":"1px solid #666", color: role==='owner'?"#10b981":"#ccc", padding:"2px 8px", borderRadius:4}}>
                  {role === 'owner' ? 'OWNER KEY' : 'CLIENT'}
              </div>
          </div>
      </header>
      
      {/* SIDEBAR DRAWER (HAMBURGER MENU - ALL MENUS HERE) */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 90}}></div>}
      <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: 280, background: "#0f172a", zIndex: 100, borderRight:"1px solid #1e293b",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease", 
          display: "flex", flexDirection: "column", height: "100%" 
      }}>
          <div style={{padding:20, borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:10}}>
              <div style={{width:32, height:32, background:"#10b981", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", color:"#022c22", fontWeight:"bold"}}><Bot/></div>
              <div>
                  <div style={{fontWeight:"bold", fontSize:14}}>Sovereign Core</div>
                  <div style={{fontSize:11, color:"#64748b"}}>Orchestrator Online</div>
              </div>
          </div>

          <div style={{flex: 1, padding: 15, overflowY:"auto", display:"flex", flexDirection:"column", gap:5}}>
              <DrawerItem icon={<Bot size={18}/>} label="AI Core Room" onClick={()=>nav('aicore')} active={view==='aicore'} color="#10b981"/>
              <div style={{height:1, background:"#1e293b", margin:"5px 0"}}></div>
              <DrawerItem icon={<Hammer size={18}/>} label="Neural Architect" onClick={()=>nav('architect')} active={view==='architect'}/>
              <DrawerItem icon={<Terminal size={18}/>} label="Termux Bridge" onClick={()=>nav('termux')} active={view==='termux'}/>
              <DrawerItem icon={<Box size={18}/>} label="Neo Grid" onClick={()=>nav('neogrid')} active={view==='neogrid'}/>
              <DrawerItem icon={<Cloud size={18}/>} label="Secure Cloud" onClick={()=>nav('cloud')} active={view==='cloud'}/>
              <DrawerItem icon={<GitBranch size={18}/>} label="Fleet Repos" onClick={()=>nav('fleet')} active={view==='fleet'}/>
              <DrawerItem icon={<Gamepad2 size={18}/>} label="Engine Bridge" onClick={()=>nav('godot')} active={view==='godot'}/>
              <DrawerItem icon={<DollarSign size={18}/>} label="Billing" onClick={()=>nav('billing')} active={view==='billing'}/>
              <DrawerItem icon={<LayoutGrid size={18}/>} label="All Apps Grid" onClick={()=>nav('apps')} active={view==='apps'}/>
              
              <div style={{marginTop:"20px", paddingTop:10, borderTop:"1px solid #1e293b"}}>
                  <DrawerItem icon={<Settings size={18}/>} label="Configuration" onClick={()=>{setShowConfig(true); setDrawerOpen(false);}} />
                  <DrawerItem icon={<UserCheck size={18}/>} label={`Switch Role (${role})`} onClick={()=>{setRole(role==='owner'?'client':'owner');}} color="#f59e0b" />
              </div>
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#0b1121" }}>
          {showConfig && <ConfigModal onClose={()=>setShowConfig(false)} />}

          {view === 'aicore' && <AICoreView nav={nav} agentAlerts={agentAlerts} setAgentAlerts={setAgentAlerts} />}
          {view === 'apps' && <AppsGrid nav={nav} />}
          {view === 'architect' && <NeuralArchitectView nav={nav} />}
          {view === 'neogrid' && <NeoGridView nav={nav} />}
          {view === 'termux' && <TermuxView nav={nav} />}
          {view === 'cloud' && <SecureCloudView nav={nav} />}
          {view === 'fleet' && <FleetView nav={nav} />}
          {view === 'godot' && <EngineBridgeView nav={nav} />}
          {view === 'billing' && <BillingView nav={nav} role={role} />}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 1. AI CORE ROOM (Home / Chat / Agent Manager)
// --------------------------------------------------------------------------
function AICoreView({nav, agentAlerts, setAgentAlerts}:any) {
    const [tab, setTab] = useState<'chat'|'reports'>('chat');
    const [messages, setMessages] = useState([
        {role: 'ai', text: "Sovereign Core v75 Online. Ready to orchestrate repos, cloud, and engines."}
    ]);
    const [input, setInput] = useState("");
    const [reports, setReports] = useState([
        {id: 1, agent: "RepoWatcher", task: "Push Commit to 'Unizan/Core'", status: "PENDING", risk: "MEDIUM"},
        {id: 2, agent: "CloudSync", task: "Encrypt & Upload 1.2GB Cache", status: "PENDING", risk: "LOW"},
    ]);
    const endRef = useRef<any>(null);

    useEffect(() => endRef.current?.scrollIntoView({behavior:"smooth"}), [messages]);

    const sendCommand = () => {
        if(!input) return;
        setMessages(p => [...p, {role:'user', text: input}]);
        setInput("");
        setTimeout(() => {
            if(input.toLowerCase().includes("build") || input.toLowerCase().includes("deploy")) {
                setMessages(p => [...p, {role:'ai', text: `Command delegated to Builder Agent. Please approve in Reports.`}]);
                const newReport = {id: Date.now(), agent: "BuilderAlpha", task: `Execute: ${input}`, status: "PENDING", risk: "HIGH"};
                setReports(p => [newReport, ...p]);
                setAgentAlerts((prev:any) => prev + 1);
            } else {
                setMessages(p => [...p, {role:'ai', text: `Processing command: "${input}" internally.`}]);
            }
        }, 600);
    };

    const handleApproval = (id:number, decision:boolean) => {
        setReports(prev => prev.map(r => r.id === id ? {...r, status: decision ? "APPROVED" : "REJECTED"} : r));
        setAgentAlerts((prev:any) => Math.max(0, prev - 1));
    };

    return (
        <div style={{height:"100%", display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", borderBottom:"1px solid #1e293b", background:"#0f172a"}}>
                <button onClick={()=>setTab('chat')} style={{flex:1, padding:15, background:tab==='chat'?"#1e293b":"transparent", border: "none", color:tab==='chat'?"#10b981":"#64748b", fontWeight:"bold", borderBottom:tab==='chat'?"2px solid #10b981":"none"}}>CORE COMMAND</button>
                <button onClick={()=>setTab('reports')} style={{flex:1, padding:15, background:tab==='reports'?"#1e293b":"transparent", border: "none", color:tab==='reports'?"#f59e0b":"#64748b", fontWeight:"bold", borderBottom:tab==='reports'?"2px solid #f59e0b":"none", display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>AGENT REPORTS {agentAlerts > 0 && <span style={{background:"#f59e0b", color:"black", fontSize:10, padding:"1px 6px", borderRadius:10}}>{agentAlerts}</span>}</button>
            </div>

            {tab === 'chat' ? (
                <>
                    <div style={{flex:1, overflowY:"auto", padding:20}}>
                        {messages.map((m,i)=>(
                            <div key={i} style={{display:"flex", marginBottom:20, justifyContent: m.role==='user'?'flex-end':'flex-start'}}>
                                <div style={{maxWidth:"85%", background: m.role==='user' ? "#10b981" : "#1e293b", color: m.role==='user' ? "#022c22" : "#e2e8f0", padding: "12px 16px", borderRadius: 8, fontSize: 14}}>{m.text}</div>
                            </div>
                        ))}
                        <div ref={endRef}></div>
                    </div>
                    <div style={{padding:15, background:"#151e32", borderTop:"1px solid #1e293b"}}>
                        <div style={{display:"flex", gap:10, background:"#0f172a", padding:5, borderRadius:8, border:"1px solid #334155"}}>
                            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendCommand()} placeholder="Core instruction..." style={{flex:1, background:"transparent", border:"none", color:"white", padding:"8px", outline:"none"}} />
                            <button onClick={sendCommand} style={{background:"#10b981", border:"none", borderRadius:6, padding:"0 15px", color:"#022c22"}}><Send size={18}/></button>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{flex:1, overflowY:"auto", padding:20, background:"#0b1121"}}>
                    {reports.map((report) => (
                        <div key={report.id} className="sov-card" style={{padding:15, marginBottom:15, borderLeft: report.status==='PENDING' ? "4px solid #f59e0b" : (report.status==='APPROVED'?"4px solid #10b981":"4px solid #ef4444")}}>
                            <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
                                <div style={{fontWeight:"bold", color:"#fff", display:"flex", alignItems:"center", gap:8}}><Bot size={16} color="#f59e0b"/> {report.agent}</div>
                                <div style={{fontSize:10, background:"#334155", padding:"2px 6px", borderRadius:4}}>{report.risk} RISK</div>
                            </div>
                            <div style={{fontSize:14, color:"#cbd5e1", marginBottom:15}}>{report.task}</div>
                            {report.status === 'PENDING' ? (
                                <div style={{display:"flex", gap:10}}>
                                    <button onClick={()=>handleApproval(report.id, true)} className="sov-btn" style={{flex:1, background:"#064e3b", color:"#34d399", border:"1px solid #10b981"}}><Check size={16}/> APPROVE</button>
                                    <button onClick={()=>handleApproval(report.id, false)} className="sov-btn" style={{flex:1, background:"#451a03", color:"#f87171", border:"1px solid #ef4444"}}><XCircle size={16}/> REJECT</button>
                                </div>
                            ) : (
                                <div style={{textAlign:"center", fontSize:12, fontWeight:"bold", color: report.status==='APPROVED'?"#10b981":"#ef4444"}}>{report.status}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --------------------------------------------------------------------------
// 2. NEURAL ARCHITECT (FULL FEATURES)
// --------------------------------------------------------------------------
function NeuralArchitectView({nav}:any) {
    const [prompt, setPrompt] = useState("");
    const [status, setStatus] = useState("READY");
    const [logs, setLogs] = useState<string[]>([]);
    
    const addLog = (text:string) => setLogs(p => [...p, `> ${text}`]);
    const runScan = () => { setStatus("SCAN"); addLog("Scanning core modules..."); setTimeout(()=>{ addLog("✅ Scan Complete. Health 98%."); setStatus("READY"); }, 1500); };
    const upload = (e:any) => { if(e.target.files[0]) { addLog(`File: ${e.target.files[0].name} uploaded.`); addLog("Injecting logic..."); } };

    return (
        <div style={{padding:20, display:"flex", flexDirection:"column", height:"100%"}}>
            <Header nav={nav} title="Neural Architect" color="#10b981"/>
            <div className="sov-card" style={{padding:20, marginBottom:20}}>
                <div style={{marginBottom:10, fontSize:12, color:"#888"}}>INSTRUCTION PROMPT</div>
                <div style={{display:"flex", gap:10, marginBottom:20}}>
                    <input className="sov-input" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Fix or Upgrade System..." />
                    <button className="sov-btn" onClick={()=>{addLog(`Prompt: ${prompt}`); setPrompt("")}}><Send size={16}/></button>
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                    <div style={{position:"relative"}}><input type="file" id="up" style={{display:"none"}} onChange={upload}/><label htmlFor="up" className="sov-btn" style={{background:"#333", width:"100%", justifyContent:"center"}}>UPLOAD PDF</label></div>
                    <button className="sov-btn" style={{background:"#f59e0b", color:"black"}} onClick={runScan}>INTERNAL SCAN</button>
                </div>
            </div>
            <div className="sov-card" style={{flex:1, background:"black", padding:10, fontFamily:"monospace", color:"#10b981", overflowY:"auto"}}>
                {logs.map((l,i)=><div key={i}>{l}</div>)}
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------
// 3. TERMUX BRIDGE (FULL FEATURES)
// --------------------------------------------------------------------------
function TermuxView({nav}:any) {
    const [h, sH] = useState(["root@sovereign:~# "]);
    const [c, sC] = useState("");
    const ex = () => { if(!c)return; sH(p=>[...p, `root@sovereign:~# ${c}`, `Executing ${c}...`, "Done.", "root@sovereign:~# "]); sC(""); };
    return (
        <div style={{height:"100%", background:"black", padding:15, fontFamily:"monospace", display:"flex", flexDirection:"column"}}>
            <Header nav={nav} title="Termux" color="white"/>
            <div style={{flex:1, color:"#10b981", overflowY:"auto"}}>
                {h.map((l,i)=><div key={i}>{l}</div>)}
                <div style={{display:"flex"}}><span style={{marginRight:5}}>root@sovereign:~#</span><input value={c} onChange={e=>sC(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ex()} style={{background:"transparent", border:"none", color:"white", flex:1, outline:"none"}} autoFocus/></div>
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------
// 4. SECURE CLOUD (FULL FEATURES)
// --------------------------------------------------------------------------
function SecureCloudView({nav}:any) {
    const [tab, setTab] = useState<'cloud'|'local'>('cloud');
    return (
        <div style={{padding:20, height:"100%"}}>
            <Header nav={nav} title="Secure Cloud" color="#3b82f6"/>
            <div style={{display:"flex", gap:10, marginBottom:20}}>
                <button onClick={()=>setTab('cloud')} className="sov-btn" style={{flex:1, background: tab==='cloud'?"#3b82f6":"#333"}}>CLOUD (Email)</button>
                <button onClick={()=>setTab('local')} className="sov-btn" style={{flex:1, background: tab==='local'?"#3b82f6":"#333"}}>LOCAL</button>
            </div>
            {tab === 'cloud' ? (
                <div className="sov-card" style={{padding:20, borderLeft:"4px solid #3b82f6"}}>
                    <div style={{color:"#aaa", fontSize:11}}>ACCOUNT</div>
                    <div style={{fontWeight:"bold"}}>muhammadilyafauzan7@gmail.com</div>
                    <div style={{marginTop:20, display:"grid", gap:10}}>
                        <FileItem name="Sovereign_Backup.apk" size="45MB"/>
                        <FileItem name="Neural_Weights.bin" size="1.2GB"/>
                    </div>
                </div>
            ) : (
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                    <FolderItem name="General Chat" count={12} />
                    <FolderItem name="Drafts" count={5} />
                    <button className="sov-card" style={{display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa"}}><Plus/></button>
                </div>
            )}
        </div>
    );
}

// --------------------------------------------------------------------------
// 5. FLEET & ENGINE (FULL FEATURES)
// --------------------------------------------------------------------------
function FleetView({nav}:any) {
    return (
        <div style={{padding:20}}>
            <Header nav={nav} title="Fleet Repos" color="#f59e0b"/>
            <div className="sov-card" style={{padding:20}}>
                <input className="sov-input" placeholder="https://github.com/user/repo" style={{marginBottom:10}}/>
                <input className="sov-input" type="password" placeholder="Token (ghp_...)" style={{marginBottom:20}}/>
                <div style={{display:"flex", gap:10}}>
                    <button className="sov-btn" style={{flex:1}}><Scan size={16}/> SCAN</button>
                    <button className="sov-btn" style={{flex:1, background:"#f59e0b", color:"black"}}><Code size={16}/> AUTO BUILD</button>
                </div>
            </div>
        </div>
    );
}
function EngineBridgeView({nav}:any) {
    return (
        <div style={{padding:20}}>
            <Header nav={nav} title="Engine Bridge" color="#a855f7"/>
            <div className="sov-card" style={{padding:40, textAlign:"center", border:"1px dashed #a855f7"}}>
                <UploadCloud size={40} color="#a855f7"/>
                <p>Upload .godot / .uproject file</p>
                <button className="sov-btn" style={{marginTop:10}}>CREATE & FIX CODE</button>
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------
// 6. OTHER MODULES (BILLING, GRID, CONFIG)
// --------------------------------------------------------------------------
function BillingView({nav,role}:any) {
    const plans = ["Free", "Standard", "Pro", "Ultimate", "Enterprise"];
    return <div style={{padding:20}}><Header nav={nav} title="Billing" color="#ec4899"/><div className="sov-card" style={{padding:20, marginBottom:20}}><h2>{role==='owner'?'OWNER (Tier 5)':'CLIENT'}</h2></div>{plans.map((p,i)=><div key={i} className="sov-card" style={{padding:10, marginBottom:5, display:"flex", justifyContent:"space-between"}}><span>{p}</span><span>{i===4?"ACTIVE":"-"}</span></div>)}</div>
}
function NeoGridView({nav}:any) { return <div style={{padding:20}}><Header nav={nav} title="Neo Grid" color="#3b82f6"/><div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}><div className="sov-card" style={{padding:20}}>CORE NODE <br/><span style={{color:"#10b981"}}>ONLINE</span></div><div className="sov-card" style={{padding:20}}>EXPLORE <br/><span style={{color:"#f59e0b"}}>SCANNING</span></div></div></div> }
function AppsGrid({nav}:any) { return <div style={{padding:20}}><Header nav={nav} title="All Apps" color="white"/><div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10}}><AppItem label="Chat" icon={<Bot/>} onClick={()=>nav('aicore')}/><AppItem label="Architect" icon={<Hammer/>} onClick={()=>nav('architect')}/><AppItem label="Termux" icon={<Terminal/>} onClick={()=>nav('termux')}/><AppItem label="Cloud" icon={<Cloud/>} onClick={()=>nav('cloud')}/></div></div> }
function ConfigModal({onClose}:any) { return <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.9)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center"}}><div className="sov-card" style={{padding:20, width:300}}><h3>Configuration</h3><p style={{fontSize:12, color:"#888"}}>ARIES API KEY</p><input className="sov-input"/><button className="sov-btn" style={{marginTop:15, width:"100%"}} onClick={onClose}>SAVE</button></div></div> }

// UI UTILS
function Header({nav, title, color}:any) { return <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:20}}><button onClick={()=>nav('aicore')} style={{background:"transparent", border:"none", color:"#aaa"}}><ChevronLeft/></button><h3 style={{margin:0, color}}>{title}</h3></div> }
function DrawerItem({icon, label, onClick, active, color}:any) { return <div onClick={onClick} style={{display:"flex", alignItems:"center", gap:12, padding:"12px 10px", borderRadius:6, cursor:"pointer", background:active?"#1e293b":"transparent", color: color || (active?"white":"#94a3b8") }}>{icon}<span style={{fontSize:14, fontWeight:"bold"}}>{label}</span></div> }
function AppItem({icon, label, onClick}:any) { return <div onClick={onClick} className="sov-card" style={{padding:15, display:"flex", flexDirection:"column", alignItems:"center", gap:10, cursor:"pointer"}}>{icon}<span style={{fontSize:11, fontWeight:"bold"}}>{label}</span></div> }
function FileItem({name, size}:any) { return <div style={{background:"#1e293b", padding:10, borderRadius:6, marginBottom:5, display:"flex", justifyContent:"space-between"}}><span>{name}</span><span style={{color:"#888"}}>{size}</span></div> }
function FolderItem({name, count}:any) { return <div style={{background:"#1e293b", padding:15, borderRadius:6, display:"flex", alignItems:"center", gap:10}}><FolderOpen color="#f59e0b" size={20}/><div><div>{name}</div><div style={{fontSize:10, color:"#666"}}>{count} files</div></div></div> }
