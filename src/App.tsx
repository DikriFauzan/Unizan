import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { MessageBubble } from './components/MessageBubble';
import { INITIAL_ROOMS } from './constants';
import { ChatRoom, Message, AppSettings } from './types';
import { generateAIResponse, generateImage, generateVideo } from './services/geminiService';
import { upgradeSystemVersion, learnNewFact, loadMemory } from './services/feacCore';
import { commitFileToGithub } from './services/githubService';
import { Brain, Send, Plus, Video, Paperclip } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeRoomId, setActiveRoomId] = useState<string | null>('admin-ai');
  const [feacVersion, setFeacVersion] = useState(() => loadMemory().version);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState('');
  
  const settings: AppSettings = { godotWsUrl: '', githubToken: localStorage.getItem('feac_pat') || '', githubRepo: 'DikriFauzan/Unizan' };

  const addMessage = (roomId: string, senderId: string, content: string, type: any = 'text', meta: any = undefined) => {
    setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), { id: Date.now().toString(), senderId, content, timestamp: new Date(), type, meta }]
    }));
  };

  const handleSendMessage = async () => {
      if(!inputText) return;
      const currentRoom = activeRoomId || 'admin-ai';
      addMessage(currentRoom, 'user', inputText);
      const prompt = inputText;
      setInputText('');

      const history = (messages[currentRoom] || []).map(m => ({ role: m.senderId==='user'?'user':'model', text: m.content }));
      
      try {
          const raw = await generateAIResponse(prompt, history, undefined, { githubRepo: settings.githubRepo });
          
          if (raw.includes('[CMD:LEARN]')) {
              const fact = raw.split('[CMD:LEARN]')[1].trim();
              learnNewFact(fact);
              addMessage(currentRoom, 'system', `🧠 MEMORY UPDATED: "${fact}"`, 'alert');
          }
          if (raw.includes('[CMD:UPGRADE_VERSION]')) {
              const newVer = upgradeSystemVersion(feacVersion);
              setFeacVersion(newVer);
              addMessage(currentRoom, 'system', `🚀 SYSTEM EVOLVED TO v${newVer}`, 'alert');
          }
          if (raw.includes('[CMD:SAVE_FILE]')) {
               const json = JSON.parse(raw.substring(raw.indexOf('{'), raw.lastIndexOf('}')+1));
               if(settings.githubToken) {
                   await commitFileToGithub(settings, json.filename, json.content, "FEAC Auto-Save");
                   addMessage(currentRoom, 'system', `✅ SAVED TO REPO: ${json.filename}`, 'alert');
               } else {
                   addMessage(currentRoom, 'system', `⚠️ Github Token Missing. Cannot save ${json.filename}`, 'alert');
               }
          }
          if (raw.includes('[CMD:GEN_IMAGE]')) {
              const p = raw.split('[CMD:GEN_IMAGE]')[1].trim();
              generateImage(p).then(img => img && addMessage(currentRoom, 'ai', p, 'image', img));
          }

          addMessage(currentRoom, 'ai', raw.replace(/\[CMD:.*?\]/g, ''));
      } catch(e) {
          addMessage(currentRoom, 'system', 'OFFLINE / ERROR', 'alert');
      }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col font-sans font-bold">
        <div className="p-4 border-b border-white/20 flex justify-between items-center bg-[#111]">
            <h1 className="text-xl font-black text-green-500 tracking-wider">FEAC SOVEREIGN v{feacVersion}</h1>
            <div className="text-xs font-mono text-gray-400">REPO: {settings.githubRepo}</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {(messages[activeRoomId || 'admin-ai'] || []).map(m => (
                <div key={m.id} className={`p-3 rounded border ${m.senderId === 'user' ? 'bg-[#003300] border-green-500 ml-auto' : 'bg-[#111] border-gray-600 mr-auto'} max-w-[90%]`}>
                    <div className="text-xs font-black mb-1 opacity-50 uppercase">{m.senderId}</div>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {m.type === 'image' && <img src={`data:image/png;base64,${m.meta}`} className="mt-2 w-full rounded border border-white/20"/>}
                </div>
            ))}
        </div>
        <div className="p-4 bg-[#111] border-t border-white/20 flex gap-2">
            <input 
                className="flex-1 bg-[#222] text-white p-3 rounded font-mono font-bold border border-white/10 focus:border-green-500 outline-none"
                placeholder="COMMAND INPUT..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
            />
            <button onClick={handleSendMessage} className="bg-green-600 px-6 rounded font-black text-black hover:bg-green-500">SEND</button>
        </div>
    </div>
  );
}
