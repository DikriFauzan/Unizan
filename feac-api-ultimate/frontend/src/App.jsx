import React, { useState } from 'react';
import { Shield, Key, Plus, Activity } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/v1';

export default function App() {
  const [keys, setKeys] = useState([]);
  const [generatedKey, setGeneratedKey] = useState(null);

  const createKey = async () => {
      // Mock App ID for demo
      const res = await axios.post(`${API_URL}/keys`, { appId: 'mock-app-id', label: 'New Key', tier: 'pro' });
      setGeneratedKey(res.data.key);
      setKeys([...keys, res.data]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
       <header className="flex items-center gap-3 border-b border-gray-800 pb-6 mb-8">
           <Shield className="text-green-500" size={32} />
           <div>
               <h1 className="text-2xl font-bold">FEAC Developer Console</h1>
               <p className="text-gray-500 text-sm">Manage API Keys & Quotas</p>
           </div>
       </header>

       <div className="max-w-3xl mx-auto">
           {generatedKey && (
               <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-8 animate-pulse">
                   <div className="text-green-400 font-bold mb-2">✅ KEY GENERATED (Copy Now)</div>
                   <code className="block bg-black p-3 rounded border border-gray-700 font-mono text-sm break-all">
                       {generatedKey}
                   </code>
               </div>
           )}

           <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold flex items-center gap-2"><Key size={18}/> Active Keys</h2>
               <button onClick={createKey} className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors">
                   <Plus size={16}/> Create Key
               </button>
           </div>

           <div className="space-y-3">
               {keys.length === 0 && <div className="text-gray-600 text-center py-8">No keys active. Create one to start.</div>}
               {keys.map(k => (
                   <div key={k.id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                       <div>
                           <div className="font-bold text-gray-200">{k.label}</div>
                           <div className="text-xs text-gray-500 font-mono mt-1">ID: {k.key_prefix}...</div>
                       </div>
                       <div className="flex items-center gap-4">
                           <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs uppercase font-bold">{k.tier}</span>
                           <Activity size={16} className="text-gray-600"/>
                       </div>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
}
