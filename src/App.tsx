import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { SecurityLock } from './components/SecurityLock';
import { Dashboard } from './pages/Dashboard';
import { NeoEngineControl } from './pages/NeoEngineControl';
import { Generators } from './pages/Generators';
import { RepoManager } from './pages/RepoManager';
import { MessageBubble } from './components/MessageBubble';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_ROOMS, NEO_AGENTS, DEFAULT_PATHS, DEFAULT_GAME_PORTS } from './constants';
import { ChatRoom, Message, TermuxNode, AppSettings, NeoAgentStatus, RevenueDataPoint, LtvDataPoint, PendingFix } from './types';
import { generateAIResponse, generateImage, generateVideo, analyzeCode } from './services/geminiService';
import { processOfflineResponse, upgradeSystemVersion, loadMemory, saveMemory } from './services/feacCore';
import { commitFileToGithub } from './services/githubService';
import { Brain, Gamepad2, Terminal, Send, Plus, X, Video, ArrowLeft, CloudUpload, Search, Code, Layers, GitBranch, Server, Bot } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('feac_api_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'neo-engine' | 'generators' | 'repo-manager'>('chat');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  
  // Self-Evolution State (Loaded from FEAC Core)
  const [feacVersion, setFeacVersion] = useState(() => {
      const mem = loadMemory();
      return mem.version;
  });
  
  // Build Trigger State
  const [triggerBuildMode, setTriggerBuildMode] = useState<'idle' | 'private' | 'public'>('idle');
  
  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
     const s = localStorage.getItem('feac_settings');
     return s ? JSON.parse(s) : { 
         godotWsUrl: '', 
         githubToken: '', 
         githubRepo: DEFAULT_PATHS.GITHUB_REPO,
         gameEndpoints: DEFAULT_GAME_PORTS 
     };
  });

  const [rooms, setRooms] = useState<ChatRoom[]>(INITIAL_ROOMS);
  const [termuxNodes, setTermuxNodes] = useState<TermuxNode[]>([]);
  // Mocking some revenue data for the demo
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([
      { name: 'Mon', uv: 4000, pv: 2400, amt: 2400 },
      { name: 'Tue', uv: 3000, pv: 1398, amt: 2210 },
      { name: 'Wed', uv: 2000, pv: 9800, amt: 2290 },
      { name: 'Thu', uv: 2780, pv: 3908, amt: 2000 },
      { name: 'Fri', uv: 1890, pv: 4800, amt: 2181 },
      { name: 'Sat', uv: 2390, pv: 3800, amt: 2500 },
      { name: 'Sun', uv: 3490, pv: 4300, amt: 2100 },
  ]);
  const [ltvData, setLtvData] = useState<LtvDataPoint[]>([]);
  const [neoAgents, setNeoAgents] = useState<NeoAgentStatus[]>(NEO_AGENTS);
  const [pendingFixes, setPendingFixes] = useState<PendingFix[]>([]);

  // Modals & UI
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectionForm, setConnectionForm] = useState({ ip: '', port: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // WebSocket
  const godotWs = useRef<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // MESSAGES
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem('feac_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved, (key, value) => key === 'timestamp' ? new Date(value) : value);
        if (!parsed['feac-conversation']) {
            parsed['feac-conversation'] = [{ id: '1', senderId: 'system', content: 'Persistent Memory Loaded.', timestamp: new Date(), type: 'text' }];
        }
        return parsed;
      }
    } catch (e) {}
    return {
      'admin-ai': [{ id: '1', senderId: 'system', content: 'FEAC Sovereign Core Initialized.\nRunning on Termux LocalHost.', timestamp: new Date(), type: 'alert' }],
      'feac-conversation': [{ id: '1', senderId: 'system', content: 'Secure Conversation Channel Ready.', timestamp: new Date(), type: 'text' }],
      'neo-bridge': [], 'termux-node': [], 'build-ci': []
    };
  });

  const [inputText, setInputText] = useState('');
  const [pendingAttachment, setPendingAttachment] = useState<{name: string, type: string, size: number, base64?: string, textContent?: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('feac_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => { localStorage.setItem('feac_settings', JSON.stringify(settings)); }, [settings]);
  
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeRoomId, pendingAttachment]);

  // WebSocket Logic
  useEffect(() => {
    if (settings.godotWsUrl) {
      if (godotWs.current) godotWs.current.close();
      setWsStatus('connecting');
      try {
          godotWs.current = new WebSocket(settings.godotWsUrl);
          godotWs.current.onopen = () => {
              setWsStatus('connected');
              addMessage('neo-bridge', 'system', `Bridge Active: ${settings.godotWsUrl}`, 'alert');
          };
          godotWs.current.onmessage = (e) => {
              try {
                  const data = JSON.parse(e.data);
                  if (data.type === 'telemetry_nodes') setTermuxNodes(data.payload);
                  else if (data.type === 'log') addMessage('neo-bridge', 'neoengine', `[REMOTE] ${data.message}`, 'code');
              } catch(err) {}
          };
          godotWs.current.onclose = () => setWsStatus('disconnected');
          godotWs.current.onerror = () => setWsStatus('disconnected');
      } catch (e) { setWsStatus('disconnected'); }
    }
  }, [settings.godotWsUrl]);

  const addMessage = (roomId: string, senderId: string, content: string, type: Message['type'] = 'text', meta?: any) => {
    const msg: Message = { id: Date.now().toString() + Math.random(), senderId, content, timestamp: new Date(), type, meta };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), msg] }));
  };

  const handleSaveSettings = (newSettings: AppSettings) => setSettings(newSettings);

  const handleConnectNode = () => {
      const wsUrl = `ws://${connectionForm.ip || '127.0.0.1'}:${connectionForm.port || '8080'}`;
      setSettings(prev => ({...prev, godotWsUrl: wsUrl}));
      setTermuxNodes(prev => [...prev, {
          id: Date.now().toString(), name: connectionForm.ip || 'LocalHost', game: 'Termux Remote', 
          status: 'online', cpu: 15, ram: 40, uptime: '0m', logs: ['Connection Established']
      }]);
      setShowConnectModal(false);
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !pendingAttachment) || !activeRoomId) return;
    const currentRoomId = activeRoomId;
    const attachmentToSend = pendingAttachment;

    const newMessage: Message = {
      id: Date.now().toString(), senderId: 'user', content: inputText, timestamp: new Date(), type: 'text',
      attachment: attachmentToSend ? { name: attachmentToSend.name, type: attachmentToSend.type, size: attachmentToSend.size, base64: attachmentToSend.base64, textContent: attachmentToSend.textContent } : undefined
    };

    setMessages(prev => ({ ...prev, [currentRoomId]: [...(prev[currentRoomId] || []), newMessage] }));
    setInputText(''); setPendingAttachment(null);

    if (currentRoomId === 'admin-ai' || currentRoomId === 'feac-conversation') {
      const history = (messages[currentRoomId] || []).slice(-15).map(m => ({ role: m.senderId === 'user' ? 'user' as const : 'model' as const, text: m.content }));
      
      try {
        const aiRaw = await generateAIResponse(
            newMessage.content, 
            history, 
            attachmentToSend ? { base64: attachmentToSend.base64, textContent: attachmentToSend.textContent, type: attachmentToSend.type, name: attachmentToSend.name } : undefined,
            { githubRepo: settings.githubRepo }
        );
        
        let content = aiRaw;
        let type: Message['type'] = 'text';
        let meta: any = undefined;

        if (aiRaw.includes('[CMD:UPGRADE_VERSION]')) {
             const newVer = upgradeSystemVersion(feacVersion); 
             setFeacVersion(newVer);
             content = aiRaw.replace('[CMD:UPGRADE_VERSION]', '').trim() || `System Upgraded to ${newVer}. Neural State Saved.`;
        }
        else if (aiRaw.includes('[CMD:BUILD_APK]')) {
             setTriggerBuildMode('private');
             setActiveTab('dashboard'); setActiveRoomId(null);
             content = "Building Private APK (Release Mode)...";
        }
        else if (aiRaw.includes('[CMD:BUILD_PUBLIC]')) {
             setTriggerBuildMode('public');
             setActiveTab('dashboard'); setActiveRoomId(null);
             content = "Building Public AAB (Google Play Mode)...";
        }
        else if (aiRaw.includes('[CMD:GEN_IMAGE]')) {
             const prompt = aiRaw.split('[CMD:GEN_IMAGE]')[1].trim();
             content = aiRaw.split('[CMD:GEN_IMAGE]')[0].trim();
             generateImage(prompt).then(img => { if(img) addMessage(currentRoomId, 'ai', prompt, 'image', img); });
        }
        else if (aiRaw.includes('[CMD:GEN_VIDEO]')) {
             const prompt = aiRaw.split('[CMD:GEN_VIDEO]')[1].trim();
             content = aiRaw.split('[CMD:GEN_VIDEO]')[0].trim();
             generateVideo(prompt).then(vid => { if(vid) addMessage(currentRoomId, 'ai', prompt, 'video', vid); });
        }
        
        if (aiRaw.includes('[CMD:STRATEGY]')) {
            content = "Strategy Engine Activated. Check Dashboard.";
            // Ideally we parse and update dashboard, for now text is sufficient feedback
        }

        addMessage(currentRoomId, 'ai', content, type, meta);

      } catch (error: any) {
          addMessage(currentRoomId, 'system', processOfflineResponse(newMessage.content), 'text');
      }
    } 
  };

  const SidebarContent = (
    <div className="flex flex-col gap-1 p-2">
       <div onClick={() => { setActiveTab('dashboard'); setActiveRoomId(null); }} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
          <Terminal size={18}/> <span>Dashboard</span>
       </div>
       <div onClick={() => { setActiveTab('neo-engine'); setActiveRoomId(null); }} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'neo-engine' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
          <Bot size={18}/> <span>NeoGrid</span>
       </div>
       <div onClick={() => { setActiveTab('generators'); setActiveRoomId(null); }} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'generators' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
          <Layers size={18}/> <span>Generators</span>
       </div>
       <div onClick={() => { setActiveTab('repo-manager'); setActiveRoomId(null); }} className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${activeTab === 'repo-manager' ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
          <GitBranch size={18}/> <span>GitHub</span>
       </div>

       <div className="mt-6 px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Active Channels</div>
       {rooms.map(r => (
           <div key={r.id} onClick={() => { setActiveTab('chat'); setActiveRoomId(r.id); }} className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${activeRoomId === r.id ? 'bg-[#333] text-white font-bold' : 'text-gray-400 hover:bg-[#222]'}`}>
              {r.type === 'ai' ? <Brain size={16} className="text-purple-400"/> : r.type === 'bridge' ? <Gamepad2 size={16} className="text-blue-400"/> : <Terminal size={16} className="text-slate-400"/>}
              <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.name}</div>
              </div>
           </div>
       ))}
       
       {/* Settings Button */}
       <div onClick={() => setShowSettings(true)} className="mt-auto p-3 rounded-md cursor-pointer flex items-center gap-3 text-gray-400 hover:bg-[#222] border-t border-white/5">
           <Server size={18}/> <span>Config</span>
       </div>
    </div>
  );

  if (!isAuthenticated) return <SecurityLock onUnlock={() => setIsAuthenticated(true)} />;

  return (
    <Layout sidebar={SidebarContent} onLogout={() => setIsAuthenticated(false)} version={feacVersion} isChatActive={activeTab === 'chat'}>
        {activeTab === 'dashboard' && <Dashboard termuxNodes={termuxNodes} settings={settings} revenueData={revenueData} triggerBuildMode={triggerBuildMode} onBuildComplete={() => setTriggerBuildMode('idle')} />}
        {activeTab === 'neo-engine' && <NeoEngineControl agents={neoAgents} onSendCommand={(id, cmd) => addMessage('neo-bridge', 'user', `[${id}] ${cmd}`)} onSaveFile={(f, c) => console.log(f, c)} onAddAgent={(a) => setNeoAgents(p => [...p, a])} />}
        {activeTab === 'generators' && <Generators />}
        {activeTab === 'repo-manager' && <RepoManager settings={settings} />}
        {activeTab === 'chat' && activeRoomId && (
            <div className="flex flex-col h-full bg-[#050505]">
                {/* Chat UI */}
                <div className="p-3 border-b border-white/5 flex items-center gap-3 bg-[#111]">
                   <span className="font-bold text-white">{rooms.find(r => r.id === activeRoomId)?.name}</span>
                   {activeRoomId === 'termux-node' && <button onClick={() => setShowConnectModal(true)}><Plus size={16}/></button>}
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scroll">
                    {messages[activeRoomId]?.map(msg => <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === 'user'}/>)}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-[#111] border-t border-white/5 flex gap-2">
                    <button onClick={() => setShowVideoModal(true)} className="p-2 text-pink-400"><Video size={20}/></button>
                    <input className="flex-1 bg-[#222] text-white p-2 rounded outline-none" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Execute Sovereign Command..." />
                    <button onClick={handleSendMessage} className="p-2 bg-green-600 rounded text-white"><Send size={18}/></button>
                </div>
            </div>
        )}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={handleSaveSettings} initialSettings={settings} />
    </Layout>
  );
}
