import React, { useState } from 'react';
import { Shield, Key, Plus, Activity, CreditCard } from 'lucide-react';
import axios from 'axios';
import Billing from './pages/Billing'; // Import Billing Page

const API_URL = 'http://localhost:3000/v1';

export default function App() {
  const [view, setView] = useState('keys'); // keys | billing
  const [keys, setKeys] = useState([]);
  const [newKey, setNewKey] = useState(null);

  const createKey = async () => {
      const res = await axios.post(`${API_URL}/keys`, { appId: 'mock-app-id', label: 'New Key', tier: 'free' });
      setNewKey(res.data.key);
      setKeys([...keys, res.data]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
       {/* Sidebar */}
       <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6">
           <div className="flex items-center gap-2 font-bold text-green-400 text-xl">
               <Shield /> FEAC Console
           </div>
           <nav className="flex flex-col gap-2">
               <button onClick={() => setView('keys')} className={`p-2 rounded text-left flex items-center gap-2 ${view==='keys' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                   <Key size={18}/> API Keys
               </button>
               <button onClick={() => setView('billing')} className={`p-2 rounded text-left flex items-center gap-2 ${view==='billing' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                   <CreditCard size={18}/> Billing
               </button>
           </nav>
       </div>

       {/* Content */}
       <div className="flex-1 bg-black overflow-y-auto">
           {view === 'billing' ? <Billing /> : (
               <div className="p-10">
                   {/* ... Existing Key Management UI ... */}
                   <div className="max-w-3xl">
                       {newKey && (
                           <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-8 animate-pulse">
                               <div className="text-green-400 font-bold mb-2">✅ KEY GENERATED</div>
                               <code className="block bg-black p-3 rounded border border-gray-700 font-mono text-sm break-all">{newKey}</code>
                           </div>
                       )}
                       <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-bold">Active Keys</h2>
                           <button onClick={createKey} className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded font-bold flex items-center gap-2"><Plus size={16}/> Create Key</button>
                       </div>
                       <div className="space-y-3">
                           {keys.length === 0 && <div className="text-gray-600 text-center py-8">No keys found.</div>}
                           {keys.map(k => (
                               <div key={k.id} className="bg-gray-900 p-4 rounded border border-gray-800 flex justify-between items-center">
                                   <div><div className="font-bold">{k.label}</div><div className="text-xs text-gray-500 font-mono">{k.prefix}...</div></div>
                                   <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">{k.tier}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}
