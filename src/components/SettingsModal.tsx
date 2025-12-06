import React, { useState, useEffect } from 'react';
import { X, Save, Gamepad2, Github, Key, Network, Plus, Trash2, CreditCard } from 'lucide-react';
import { AppSettings, GameEndpoint } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  initialSettings: AppSettings;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [form, setForm] = useState<AppSettings>(initialSettings);

  useEffect(() => {
    setForm(initialSettings);
  }, [initialSettings, isOpen]);

  const addPort = () => {
      setForm(prev => ({
          ...prev,
          gameEndpoints: [...(prev.gameEndpoints || []), { id: Date.now().toString(), name: 'New Service', port: '8000', type: 'telemetry', status: 'active' }]
      }));
  };

  const updatePort = (id: string, field: keyof GameEndpoint, value: string) => {
      setForm(prev => ({
          ...prev,
          gameEndpoints: prev.gameEndpoints.map(p => p.id === id ? { ...p, [field]: value } : p)
      }));
  };

  const removePort = (id: string) => {
      setForm(prev => ({
          ...prev,
          gameEndpoints: prev.gameEndpoints.filter(p => p.id !== id)
      }));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#202c33] w-full max-w-lg rounded-lg shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#111b21] rounded-t-lg">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Key size={18} className="text-green-400" /> System Config
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Billing Section */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-green-400 font-bold border-b border-green-500/20 pb-1">
                <CreditCard size={18} /> Billing / Revenue Core
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Backend API URL (Stripe Server)</label>
                <input 
                  className="w-full bg-[#111b21] p-3 rounded text-sm text-white border border-slate-700 focus:border-green-500 outline-none font-mono"
                  placeholder="http://YOUR_SERVER_IP:3000/v1"
                  value={form.billingApiUrl}
                  onChange={e => setForm({...form, billingApiUrl: e.target.value})}
                />
                <p className="text-[10px] text-slate-500 mt-1">Point this to your FEAC Billing Backend.</p>
             </div>
          </div>

          {/* GitHub Section */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-purple-500/20 pb-1">
                <Github size={18} /> GitHub Repository Access
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Personal Access Token (PAT)</label>
                <input 
                  type="password"
                  className="w-full bg-[#111b21] p-3 rounded text-sm text-white border border-slate-700 focus:border-purple-500 outline-none font-mono"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={form.githubToken}
                  onChange={e => setForm({...form, githubToken: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">Active Repository (user/repo)</label>
                <input 
                  className="w-full bg-[#111b21] p-3 rounded text-sm text-white border border-slate-700 focus:border-purple-500 outline-none font-mono"
                  placeholder="username/project-feac"
                  value={form.githubRepo}
                  onChange={e => setForm({...form, githubRepo: e.target.value})}
                />
             </div>
          </div>

          {/* Game Ports Section */}
          <div className="space-y-3">
             <div className="flex items-center justify-between text-orange-400 font-bold border-b border-orange-500/20 pb-1">
                <div className="flex items-center gap-2"><Network size={18} /> Telemetry Ports</div>
                <button onClick={addPort} className="text-xs bg-orange-500/20 hover:bg-orange-500 hover:text-white px-2 py-1 rounded transition-colors"><Plus size={14}/></button>
             </div>
             <div className="space-y-2">
                 {(form.gameEndpoints || []).map(port => (
                     <div key={port.id} className="flex gap-2 items-center bg-[#111b21] p-2 rounded border border-slate-700">
                         <input className="w-16 bg-black/30 p-1 rounded text-xs text-green-400 font-mono text-center" value={port.port} onChange={e => updatePort(port.id, 'port', e.target.value)} />
                         <input className="flex-1 bg-transparent p-1 text-sm text-white outline-none" value={port.name} onChange={e => updatePort(port.id, 'name', e.target.value)} />
                         <button onClick={() => removePort(port.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14}/></button>
                     </div>
                 ))}
             </div>
          </div>
        </div>

        <div className="p-4 bg-[#111b21] border-t border-slate-700 rounded-b-lg">
           <button onClick={() => { onSave(form); onClose(); }} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold flex items-center justify-center gap-2 shadow-lg transition-colors">
              <Save size={18} /> SAVE CONFIGURATION
           </button>
        </div>
      </div>
    </div>
  );
};
