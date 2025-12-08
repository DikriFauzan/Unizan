import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { SecurityLock } from './components/SecurityLock';
import { Dashboard } from './pages/Dashboard';
import { NeoEngineControl } from './pages/NeoEngineControl';
import { Generators } from './pages/Generators';
import { RepoManager } from './pages/RepoManager';
import { Billing } from './pages/Billing';
import { MessageBubble } from './components/MessageBubble';
import { SettingsModal } from './components/SettingsModal';
import { UpdateOverlay } from './components/UpdateOverlay';
import { INITIAL_ROOMS, NEO_AGENTS, DEFAULT_PATHS, DEFAULT_GAME_PORTS, MOCK_TERMUX_NODES } from './constants';
import { ChatRoom, Message, TermuxNode, AppSettings, ReleaseInfo } from './types';
import { generateAIResponse } from './services/geminiService';
import { loadMemory } from './services/feacCore';
import { checkGithubUpdate, performHotUpdate } from './services/updateService';
import { Brain, Terminal, GitBranch, Bot, CreditCard, Send, Server, Key, ChevronRight, RefreshCw, ShieldCheck, Database, TriangleAlert } from 'lucide-react';

export default function App() {
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState('');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'neo-engine' | 'generators' | 'repo-manager' | 'billing'>('chat');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [feacVersion, setFeacVersion] = useState(() => loadMemory().version);
  
  const [updateInfo, setUpdateInfo] = useState<ReleaseInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [showReloadModal, setShowReloadModal] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
     try {
         const s = localStorage.getItem('feac_settings');
         const apiKey = localStorage.getItem('feac_api_key') || undefined;
         const superKey = localStorage.getItem('feac_super_key') || undefined;
         const flowithApiKey = localStorage.getItem('feac_flowith_key') || undefined;
         const parsed = s ? JSON.parse(s) : { godotWsUrl: '', githubToken: '', githubRepo: 'DikriFauzan/Unizan', gameEndpoints: [] };
         return { ...parsed, apiKey: parsed.apiKey || apiKey, superKey: parsed.superKey || superKey, flowithApiKey: parsed.flowithApiKey || flowithApiKey }; 
     } catch (e) { return { godotWsUrl: '', githubToken: '', githubRepo: '', gameEndpoints: [] }; }
  });

  const [termuxNodes, setTermuxNodes] = useState<TermuxNode[]>(MOCK_TERMUX_NODES);
  const [rooms, setRooms] = useState<ChatRoom[]>(INITIAL_ROOMS);
  const [messages, setMessages] = useState<Record<string, Message[]>>({'admin-ai': []});
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // KEY LEAK HANDLER
  const handleKeyLeak = () => {
      // 1. Alert UI
      setMessages(prev => ({
          ...prev, 
          'admin-ai': [...(prev['admin-ai'] || []), {
              id: Date.now().toString(),
              senderId: 'system',
              content: "CRITICAL SECURITY ALERT: The current API Key has been flagged as LEAKED by Google. Access revoked.",
              timestamp: new Date(),
              type: 'alert'
          }]
      }));
      // 2. Clear bad key
      localStorage.removeItem('feac_api_key');
      // 3. Force Open Settings to enter new one
      alert("⚠️ SYSTEM ALERT: API Key Leaked (403). Please enter a new valid key in Settings.");
      setShowSettings(true);
  };

  const handleApplyUpdate = async () => {
      if(!updateInfo) return;
      setIsUpdating(true);
      const success = await performHotUpdate(updateInfo.url, setUpdateProgress);
      if(success) {
          setFeacVersion(updateInfo.tag);
          setUpdateInfo(null);
          setIsUpdating(false);
          setShowReloadModal(true);
      }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
      setSettings(newSettings);
      localStorage.setItem('feac_settings', JSON.stringify(newSettings));
      if (newSettings.apiKey) localStorage.setItem('feac_api_key', newSettings.apiKey);
      if (newSettings.superKey) localStorage.setItem('feac_super_key', newSettings.superKey);
      if (newSettings.flowithApiKey) localStorage.setItem('feac_flowith_key', newSettings.flowithApiKey);
      if (newSettings.apiKey || newSettings.superKey) setApiKeyReady(true);
  };

  useEffect(() => {
      if (settings.apiKey || settings.superKey || process.env.API_KEY) setApiKeyReady(true);
  }, []);

  const handleSaveKey = () => {
      try {
          if (inputKey.trim().startsWith('{')) {
              const keys = JSON.parse(inputKey);
              const newSettings = { ...settings };
              if (keys.gemini) { localStorage.setItem('feac_api_key', keys.gemini); newSettings.apiKey = keys.gemini; }
              if (keys.flowith) { localStorage.setItem('feac_flowith_key', keys.flowith); newSettings.flowithApiKey = keys.flowith; }
              if (keys.super) { localStorage.setItem('feac_super_key', keys.super); newSettings.superKey = keys.super; }
              setSettings(newSettings); setApiKeyReady(true);
              alert('Keys Injected.');
              return;
          }
      } catch (e) {}
      if (inputKey.length > 5) {
          localStorage.setItem('feac_api_key', inputKey);
          setSettings(prev => ({...prev, apiKey: inputKey}));
          setApiKeyReady(true);
      }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeRoomId) return;
    const roomId = activeRoomId;
    const msg: Message = { id: Date.now().toString(), senderId: 'user', content: inputText, timestamp: new Date(), type: 'text' };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), msg] }));
    setInputText('');
    
    if (roomId === 'admin-ai') {
        const history = (messages[roomId] || []).map(m => ({role: m.senderId==='user'?'user':'model', text: m.content}));
        const response = await generateAIResponse(msg.content, history as any, undefined, settings);
        
        // INTERCEPT LEAK ERROR
        if (response === "[SYSTEM_ERROR]: LEAKED_KEY") {
            handleKeyLeak();
            return;
        }

        const aiMsg: Message = { id: Date.now().toString(), senderId: 'ai', content: response, timestamp: new Date(), type: 'text' };
        setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), aiMsg] }));
    }
  };

  if (!apiKeyReady) {
      return (
          <div className="h-screen w-screen bg-[#0b141a] flex flex-col items-center justify-center text-[#e9edef] p-6 text-center font-sans">
              <div className="w-24 h-24 bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse border border-green-500/50">
                  <Brain size={48} className="text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">NEURAL LINK REQUIRED</h1>
              <p className="text-gray-400 mb-8 max-w-xs text-sm">Inject Keys to activate FEAC Sovereign Core.<br/>Supported: Gemini, Flowith, FEAC-SVR.</p>
              <div className="w-full max-w-sm space-y-4">
                  <div className="bg-[#1f2c34] p-2 rounded-lg flex items-center border border-gray-700">
                      <Key size={20} className="text-gray-500 ml-2" />
                      <input value={inputKey} onChange={e => setInputKey(e.target.value)} placeholder='Key or {"gemini":"...", ...}' className="bg-transparent border-none outline-none text-white text-sm p-2 flex-1 w-full font-mono" type="password" />
                  </div>
                  <button onClick={handleSaveKey} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
                      {inputKey.includes('{') ? <Database size={18}/> : <ChevronRight size={18}/>}
                      {inputKey.includes('{') ? 'INJECT MULTI-KEY PAYLOAD' : 'ACTIVATE CORE'}
                  </button>
              </div>
          </div>
      );
  }

  if (!isAuthenticated) return <SecurityLock onUnlock={() => setIsAuthenticated(true)} />;

  const SidebarContent = (
    <div className="flex flex-col gap-1 p-2">
       <div onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}><Terminal size={18}/> <span>Dashboard</span></div>
       <div onClick={() => setActiveTab('neo-engine')} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'neo-engine' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}><Bot size={18}/> <span>NeoGrid</span></div>
       <div onClick={() => setActiveTab('repo-manager')} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'repo-manager' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}><GitBranch size={18}/> <span>GitHub</span></div>
       <div onClick={() => setActiveTab('billing')} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'billing' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}><CreditCard size={18}/> <span>Billing</span></div>
       <div className="mt-6 px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Chat</div>
       {rooms.map(r => (
           <div key={r.id} onClick={() => { setActiveTab('chat'); setActiveRoomId(r.id); }} className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${activeRoomId === r.id ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
              <Brain size={16} className="text-purple-400"/> <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{r.name}</div></div>
           </div>
       ))}
       <div onClick={() => setShowSettings(true)} className="mt-auto p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222] border-t border-white/5"><Server size={18}/> <span>Config</span></div>
    </div>
  );

  return (
    <Layout sidebar={SidebarContent} onLogout={() => setIsAuthenticated(false)} version={feacVersion} isChatActive={activeTab === 'chat'}>
        {updateInfo && <UpdateOverlay info={updateInfo} isUpdating={isUpdating} progress={updateProgress} onUpdate={handleApplyUpdate} onDismiss={() => setUpdateInfo(null)} />}
        
        {showReloadModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
             <div className="bg-[#0b141a] rounded-lg shadow-2xl max-w-sm w-full border border-green-500/30 overflow-hidden">
                <div className="bg-green-900/20 p-4 flex items-center gap-3 border-b border-white/5">
                    <div className="bg-green-500/20 p-2 rounded-full"><RefreshCw size={20} className="text-green-400 animate-spin"/></div>
                    <div><h3 className="text-sm font-bold text-green-400 tracking-widest uppercase">NEURAL CORE UPDATE</h3><p className="text-xs text-green-600 font-mono">v{feacVersion}</p></div>
                </div>
                <div className="p-6">
                    <p className="text-slate-400 mb-6 text-sm">Neural Core Update available. System optimization complete.</p>
                    <div className="space-y-1 mb-6"><div className="flex justify-between text-[10px] text-green-500 font-bold"><span>DOWNLOADING PATCH...</span><span>100%</span></div><div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-full"></div></div></div>
                    <div className="bg-[#202c33] p-4 rounded text-center mb-4"><h4 className="text-white font-bold">Updated! Reloading...</h4></div>
                    <div className="flex justify-end"><button onClick={() => window.location.reload()} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-widest text-xs py-3 rounded transition-colors shadow-lg">OK</button></div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'chat' && activeRoomId && (
           <div className="flex flex-col h-full bg-[#0b141a]">
               {/* ERROR NOTIFICATION FOR KEY LEAK */}
               {!settings.apiKey && (
                   <div className="bg-red-900/50 p-2 text-center text-xs text-red-300 font-bold border-b border-red-500 flex items-center justify-center gap-2 cursor-pointer" onClick={() => setShowSettings(true)}>
                       <TriangleAlert size={14}/> API KEY MISSING OR REVOKED. TAP TO CONFIGURE.
                   </div>
               )}

               <div className="flex-1 p-4 overflow-y-auto"><div ref={messagesEndRef} />{messages[activeRoomId]?.map(m => <MessageBubble key={m.id} message={m} isMe={m.senderId==='user'}/>)}</div>
               <div className="p-4 bg-[#202c33] flex gap-2"><input className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2 text-white outline-none" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Cmd..." /><button onClick={handleSendMessage} className="bg-green-600 p-2 rounded-full text-white"><Send size={20}/></button></div>
           </div>
       )}
       {activeTab === 'dashboard' && <Dashboard termuxNodes={termuxNodes} settings={settings} />}
       {activeTab === 'repo-manager' && <RepoManager settings={settings} />}
       {activeTab === 'billing' && <Billing settings={settings} />}
       {activeTab === 'neo-engine' && <NeoEngineControl agents={NEO_AGENTS} onSendCommand={()=>{}} onSaveFile={()=>{}} onAddAgent={()=>{}} />}
       {activeTab === 'generators' && <Generators />}
       <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initialSettings={settings} />
    </Layout>
  );
}
