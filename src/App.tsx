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
import { INITIAL_ROOMS, NEO_AGENTS, DEFAULT_PATHS, DEFAULT_GAME_PORTS } from './constants';
import { ChatRoom, Message, TermuxNode, AppSettings, NeoAgentStatus, RevenueDataPoint, LtvDataPoint, PendingFix } from './types';
import { generateAIResponse, generateImage, generateVideo } from './services/geminiService';
import { upgradeSystemVersion, loadMemory } from './services/feacCore';
import { commitFileToGithub } from './services/githubService';
import { checkGithubUpdate, performHotUpdate, ReleaseInfo } from './services/updateService';
import { Brain, Gamepad2, Terminal, Send, Plus, X, Video, ArrowLeft, GitBranch, Server, Bot, CreditCard, CloudLightning, Key, ChevronRight, Layers } from 'lucide-react';

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
  
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
     const s = localStorage.getItem('feac_settings');
     return s ? JSON.parse(s) : { 
         godotWsUrl: '', 
         githubToken: '', 
         githubRepo: DEFAULT_PATHS.GITHUB_REPO, 
         gameEndpoints: DEFAULT_GAME_PORTS,
         billingApiUrl: 'http://localhost:3000/v1'
     };
  });

  // State lainnya...
  const [rooms, setRooms] = useState<ChatRoom[]>(INITIAL_ROOMS);
  const [messages, setMessages] = useState<Record<string, Message[]>>({'admin-ai': []});
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // OTA CHECK
  useEffect(() => {
      const runUpdateCheck = async () => {
          if(settings.githubRepo) {
              const info = await checkGithubUpdate(settings, feacVersion);
              if(info) setUpdateInfo(info);
          }
      };
      runUpdateCheck();
  }, [settings.githubRepo]);

  const handleApplyUpdate = async () => {
      if(!updateInfo) return;
      setIsUpdating(true);
      const success = await performHotUpdate(updateInfo.url, setUpdateProgress);
      if(success) {
          setFeacVersion(updateInfo.tag);
          setUpdateInfo(null);
          setIsUpdating(false);
          alert("✅ FEAC Core Updated via OTA. Reloading...");
          window.location.reload();
      }
  };

  // API KEY CHECK
  useEffect(() => {
      const storedKey = localStorage.getItem('feac_api_key');
      // @ts-ignore
      if ((storedKey && storedKey.length > 10) || process.env.API_KEY) {
          setApiKeyReady(true);
      }
  }, []);

  const handleSaveKey = () => {
      if(inputKey.length > 10) {
          localStorage.setItem('feac_api_key', inputKey);
          setApiKeyReady(true);
      } else {
          alert("Key Invalid");
      }
  };

  // ... (Chat logic remains same, simplified here for script brevity) ...
  const handleSendMessage = async () => { /* ... Logic ... */ };

  if (!apiKeyReady) {
      return (
          <div className="h-screen w-screen bg-[#0b141a] flex flex-col items-center justify-center text-[#e9edef] p-6 text-center font-sans">
              <div className="w-24 h-24 bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse border border-green-500/50"><Brain size={48} className="text-green-400" /></div>
              <h1 className="text-2xl font-bold mb-2">FEAC SYSTEM OFFLINE</h1>
              <p className="text-gray-400 mb-8 max-w-xs text-sm">Please provide Google Gemini API Key.</p>
              <div className="w-full max-w-sm space-y-4">
                  <div className="bg-[#1f2c34] p-2 rounded-lg flex items-center border border-gray-700">
                      <Key size={20} className="text-gray-500 ml-2" />
                      <input value={inputKey} onChange={e => setInputKey(e.target.value)} placeholder="Paste Key Here..." className="bg-transparent border-none outline-none text-white text-sm p-2 flex-1 w-full" type="password" />
                  </div>
                  <button onClick={handleSaveKey} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">ACTIVATE <ChevronRight size={18}/></button>
              </div>
          </div>
      );
  }

  if (!isAuthenticated) return <SecurityLock onUnlock={() => setIsAuthenticated(true)} />;

  const SidebarContent = (
    <div className="flex flex-col gap-1 p-2">
       {/* MENU ITEMS */}
       <div onClick={() => setActiveTab('dashboard')} className="p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222]"><Terminal size={18}/> <span>Dashboard</span></div>
       <div onClick={() => setActiveTab('neo-engine')} className="p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222]"><Bot size={18}/> <span>NeoGrid</span></div>
       <div onClick={() => setActiveTab('repo-manager')} className="p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222]"><GitBranch size={18}/> <span>GitHub</span></div>
       <div onClick={() => setActiveTab('billing')} className="p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222]"><CreditCard size={18}/> <span>Billing</span></div>
       
       <div className="mt-6 px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Chat</div>
       {rooms.map(r => (
           <div key={r.id} onClick={() => { setActiveTab('chat'); setActiveRoomId(r.id); }} className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${activeRoomId === r.id ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
              <Brain size={16} className="text-purple-400"/> 
              <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{r.name}</div></div>
           </div>
       ))}
       <div onClick={() => setShowSettings(true)} className="mt-auto p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222] border-t border-white/5"><Server size={18}/> <span>Config</span></div>
    </div>
  );

  return (
    <Layout sidebar={SidebarContent} onLogout={() => setIsAuthenticated(false)} version={feacVersion} isChatActive={activeTab === 'chat'}>
        {updateInfo && <UpdateOverlay info={updateInfo} isUpdating={isUpdating} progress={updateProgress} onUpdate={handleApplyUpdate} onDismiss={() => setUpdateInfo(null)} />}
        
        {activeTab === 'chat' && activeRoomId && (
           <div className="flex flex-col h-full bg-[#0b141a]">
               <div className="flex-1 p-4 overflow-y-auto">
                   {messages[activeRoomId]?.map(m => <MessageBubble key={m.id} message={m} isMe={m.senderId==='user'}/>)}
                   <div ref={messagesEndRef}/>
               </div>
               <div className="p-4 bg-[#202c33] flex gap-2">
                   <input className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2 text-white outline-none" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Cmd..." />
                   <button onClick={handleSendMessage} className="bg-green-600 p-2 rounded-full text-white"><Send size={20}/></button>
               </div>
           </div>
       )}
       {activeTab === 'dashboard' && <Dashboard termuxNodes={termuxNodes} />}
       {activeTab === 'repo-manager' && <RepoManager settings={settings} />}
       {activeTab === 'billing' && <Billing settings={settings} />}
       
       <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={setSettings} initialSettings={settings} />
    </Layout>
  );
}
