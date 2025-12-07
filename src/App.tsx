import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { SecurityLock } from './components/SecurityLock';
import { Dashboard } from './pages/Dashboard';
import { RepoManager } from './pages/RepoManager';
import { Billing } from './pages/Billing';
import { MessageBubble } from './components/MessageBubble';
import { SettingsModal } from './components/SettingsModal';
import { UpdateOverlay } from './components/UpdateOverlay';
import { INITIAL_ROOMS, DEFAULT_PATHS, DEFAULT_GAME_PORTS, MOCK_TERMUX_NODES } from './constants';
import { ChatRoom, Message, TermuxNode, AppSettings } from './types';
import { generateAIResponse, generateImage, generateVideo } from './services/geminiService';
import { loadMemory } from './services/feacCore';
import { checkGithubUpdate, performHotUpdate, ReleaseInfo } from './services/updateService';
import { Brain, Terminal, Send, Plus, Video, GitBranch, Server, CreditCard, Key, ChevronRight } from 'lucide-react';

// Hardcoded Keys for Fallback
const INJECTED_KEY = "AIzaSyAxpQtIuE7vFw5KtXIEUFyY-qcFn6uBejo";

export default function App() {
  const [apiKeyReady, setApiKeyReady] = useState(true); // FORCE TRUE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'repo-manager' | 'billing'>('chat');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [feacVersion, setFeacVersion] = useState("7.1.0-Unleashed");
  
  const [updateInfo, setUpdateInfo] = useState<ReleaseInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ godotWsUrl: '', githubToken: '', githubRepo: DEFAULT_PATHS.GITHUB_REPO, gameEndpoints: DEFAULT_GAME_PORTS });
  const [rooms, setRooms] = useState<ChatRoom[]>(INITIAL_ROOMS);
  
  // RESET MESSAGES TO v7.1 DEFAULT
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    return {
      'admin-ai': [
        { 
          id: '1', 
          senderId: 'system', 
          content: '⚡ SYSTEM REBOOT: Keys Injected (Gemini + Flowith).\n> Superkey Active.\n> Brain v7.1 Online.', 
          timestamp: new Date(), 
          type: 'alert' 
        },
        { 
          id: '2', 
          senderId: 'ai', 
          content: 'FEAC v7.1 Ready. All keys are active. No lobotomy here. What is the mission?', 
          timestamp: new Date(), 
          type: 'text' 
        }
      ]
    };
  });
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-Save Key on Load if missing
  useEffect(() => {
      if (!localStorage.getItem('feac_api_key')) {
          localStorage.setItem('feac_api_key', INJECTED_KEY);
      }
  }, []);

  // OTA Check
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
      await performHotUpdate(updateInfo.url, setUpdateProgress);
      alert("Updated! Reloading...");
      window.location.reload();
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
        const aiMsg: Message = { id: Date.now().toString(), senderId: 'ai', content: response, timestamp: new Date(), type: 'text' };
        setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), aiMsg] }));
    }
  };

  if (!isAuthenticated) return <SecurityLock onUnlock={() => setIsAuthenticated(true)} />;

  const SidebarContent = (
    <div className="flex flex-col gap-1 p-2">
       <div onClick={() => setActiveTab('dashboard')} className="p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222]"><Terminal size={18}/> <span>Dashboard</span></div>
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
       {activeTab === 'dashboard' && <Dashboard termuxNodes={[]} settings={settings} />}
       {activeTab === 'repo-manager' && <RepoManager settings={settings} />}
       {activeTab === 'billing' && <Billing settings={settings} />}
       <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={setSettings} initialSettings={settings} />
    </Layout>
  );
}
