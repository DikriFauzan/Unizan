import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { SecurityLock } from './components/SecurityLock';
import { Dashboard } from './pages/Dashboard';
import { MessageBubble } from './components/MessageBubble';
import { INITIAL_ROOMS, APP_VERSION } from './constants';
import { Brain, Gamepad2, Terminal, Hammer, Send, Plus } from 'lucide-react';

export default function App() {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [activeRoom, setActiveRoom] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState({
      'admin-ai': [{id:1, senderId:'ai', content:'FEAC v2.1 Online. Ready for command.', timestamp: new Date(), type:'text'}],
      'neo-bridge': [{id:1, senderId:'system', content:'Bridge Connected.', timestamp: new Date(), type:'alert'}]
  });
  const [autoBuild, setAutoBuild] = useState(null);

  const handleSend = () => {
      if (!input.trim()) return;
      const newMsg = { id: Date.now(), senderId: 'user', content: input, timestamp: new Date(), type: 'text' };
      setMessages(prev => ({...prev, [activeRoom]: [...(prev[activeRoom]||[]), newMsg]}));
      
      // Simulasi Respons AI
      setTimeout(() => {
          let reply = "Command received.";
          let type = "text";
          
          if (input.toLowerCase().includes("build")) {
              reply = "Initializing Build Protocol... Switch to Dashboard to monitor.";
              setTab('dashboard');
              setAutoBuild('private');
          } else if (input.toLowerCase().includes("code")) {
              reply = "func _ready():\n\tprint('Hello NeoEngine')";
              type = "code";
          } else if (input.toLowerCase().includes("status")) {
               reply = "All systems operational. Vault Secure.";
          }

          const aiMsg = { id: Date.now()+1, senderId: 'ai', content: reply, timestamp: new Date(), type };
          setMessages(prev => ({...prev, [activeRoom]: [...(prev[activeRoom]||[]), aiMsg]}));
      }, 800);
      
      setInput('');
  };

  if (!auth) return <SecurityLock onUnlock={() => setAuth(true)} />;

  const Sidebar = (
      <div className="p-2 space-y-1">
          <div className="p-3 font-bold text-[#00a884]">MENU UTAMA</div>
          <button onClick={() => {setTab('dashboard'); setActiveRoom(null)}} className={`w-full text-left p-3 rounded flex gap-3 hover:bg-[#2a3942] ${tab==='dashboard'?'bg-[#2a3942]':''}`}>
              <ActivityIcon/> Dashboard
          </button>
          <div className="p-3 font-bold text-[#00a884] mt-4">CHANNELS</div>
          {INITIAL_ROOMS.map(r => (
              <button key={r.id} onClick={() => {setTab('chat'); setActiveRoom(r.id)}} className={`w-full text-left p-3 rounded flex gap-3 hover:bg-[#2a3942] ${activeRoom===r.id?'bg-[#2a3942]':''}`}>
                  <RoomIcon type={r.type}/> {r.name}
              </button>
          ))}
      </div>
  );

  return (
    <Layout sidebar={Sidebar} onLogout={() => setAuth(false)} version={APP_VERSION}>
        {tab === 'dashboard' ? (
            <Dashboard autoBuildType={autoBuild} />
        ) : (
            <div className="flex flex-col h-full">
                <div className="h-16 bg-[#202c33] flex items-center px-4 font-bold border-b border-[#111b21] shadow-md">
                    {INITIAL_ROOMS.find(r=>r.id===activeRoom)?.name || 'Chat'}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {messages[activeRoom]?.map(m => <MessageBubble key={m.id} message={m} isMe={m.senderId==='user'}/>)}
                </div>
                <div className="p-3 bg-[#202c33] flex gap-2 items-center">
                    <button className="p-2 text-gray-400 hover:text-white"><Plus/></button>
                    <input 
                        className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2 outline-none text-sm" 
                        placeholder="Type a command..."
                        value={input}
                        onChange={e=>setInput(e.target.value)}
                        onKeyDown={e=>e.key==='Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="p-2 bg-[#00a884] rounded-full text-black"><Send size={18}/></button>
                </div>
            </div>
        )}
    </Layout>
  );
}

const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const RoomIcon = ({type}) => {
    if(type==='ai') return <Brain size={20} className="text-purple-400"/>;
    if(type==='bridge') return <Gamepad2 size={20} className="text-blue-400"/>;
    return <Terminal size={20} className="text-yellow-400"/>;
};
