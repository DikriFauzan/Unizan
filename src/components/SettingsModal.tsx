import React, { useState, useEffect } from 'react';
import { X, Save, Gamepad2, Github, Key, Network, ShieldAlert, Lock, Zap, RefreshCw, Cpu } from 'lucide-react';
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

  const generateSuperKey = () => {
      const array = new Uint8Array(24);
      window.crypto.getRandomValues(array);
      const randomPart = Array.from(array, dec => dec.toString(16).padStart(2, '0')).join('');
      const key = `FEAC-SVR-${randomPart.substring(0, 16).toUpperCase()}`;
      setForm(prev => ({ ...prev, superKey: key }));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#202c33] w-full max-w-lg rounded-lg shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#111b21] rounded-t-lg">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Lock size={18} className="text-green-400" /> System Configuration
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto custom-scroll">
          <div className="space-y-3 bg-gradient-to-br from-green-900/10 to-blue-900/10 p-4 rounded border border-green-500/20">
             <div className="flex items-center gap-2 text-green-400 font-bold border-b border-green-500/20 pb-2 mb-2">
                <ShieldAlert size={18} /> Neural Network Keys (Injection)
             </div>
             <div>
                <label className="flex items-center gap-2 text-xs text-purple-400 mb-1 font-bold"><Zap size={10} /> GOOGLE GEMINI API</label>
                <input type="password" className="w-full bg-[#0b141a] p-2 rounded text-sm text-white border border-slate-700 focus:border-purple-500 outline-none font-mono tracking-widest" placeholder="sk-..." value={form.apiKey || ''} onChange={e => setForm({...form, apiKey: e.target.value})} />
             </div>
             <div>
                <label className="flex items-center gap-2 text-xs text-blue-400 mb-1 font-bold"><Network size={10} /> FLOWITH API</label>
                <input type="password" className="w-full bg-[#0b141a] p-2 rounded text-sm text-white border border-slate-700 focus:border-blue-500 outline-none font-mono tracking-widest" placeholder="flow-..." value={form.flowithApiKey || ''} onChange={e => setForm({...form, flowithApiKey: e.target.value})} />
             </div>
             <div>
                <label className="flex items-center gap-2 text-xs text-red-400 mb-1 font-bold"><Key size={10} /> FEAC SUPERKEY (SOVEREIGN)</label>
                <div className="flex gap-2">
                    <input type="text" className="flex-1 bg-[#0b141a] p-2 rounded text-sm text-red-400 border border-slate-700 focus:border-red-500 outline-none font-mono tracking-widest" placeholder="FEAC-SVR-..." value={form.superKey || ''} onChange={e => setForm({...form, superKey: e.target.value})} />
                    <button onClick={generateSuperKey} className="bg-red-900/30 hover:bg-red-900/50 text-red-400 p-2 rounded border border-red-500/30 transition-colors"><RefreshCw size={16} /></button>
                </div>
             </div>
          </div>
          {/* GitHub Config */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-purple-500/20 pb-1"><Github size={18} /> GitHub Repository</div>
             <div><label className="block text-xs text-gray-400 mb-1">Token (PAT)</label><input type="password" className="w-full bg-[#111b21] p-3 rounded text-sm text-white border border-slate-700" value={form.githubToken} onChange={e => setForm({...form, githubToken: e.target.value})} /></div>
             <div><label className="block text-xs text-gray-400 mb-1">Repo (user/name)</label><input className="w-full bg-[#111b21] p-3 rounded text-sm text-white border border-slate-700" value={form.githubRepo} onChange={e => setForm({...form, githubRepo: e.target.value})} /></div>
          </div>
        </div>
        <div className="p-4 bg-[#111b21] border-t border-slate-700 rounded-b-lg">
           <button onClick={() => { onSave(form); onClose(); }} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold flex items-center justify-center gap-2 shadow-lg"><Save size={18} /> SAVE CONFIGURATION</button>
        </div>
      </div>
    </div>
  );
};
