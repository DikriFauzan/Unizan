import React, { useState } from 'react';
import { Palette, ShieldCheck, Download, Code, Layers } from 'lucide-react';
import { GeneratorType } from '../types';

export const Generators = () => {
  const [activeTab, setActiveTab] = useState<GeneratorType>('ui-layout');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = () => {
      setLoading(true);
      setResult(null);
      setTimeout(() => {
          setLoading(false);
          if (activeTab === 'ui-layout') setResult("UI Layout Generated: /res/ui/hud_main.tscn");
          if (activeTab === 'shader') setResult("Shader Compiled: /res/shaders/neon_glow.gdshader");
          if (activeTab === 'apk-signer') setResult("Key Generated: feac-release.keystore (RSA-2048)");
      }, 2000);
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#e9edef] flex items-center gap-2">
           <Code className="text-[#00a884]"/> Asset Generators
        </h1>

        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-1">
            <button onClick={()=>setActiveTab('ui-layout')} className={`px-4 py-2 rounded-t-lg flex items-center gap-2 font-medium text-sm transition-colors ${activeTab==='ui-layout' ? 'bg-[#202c33] text-green-400 border-t border-x border-slate-700' : 'text-slate-500'}`}><Layers size={16}/> UI Layout</button>
            <button onClick={()=>setActiveTab('shader')} className={`px-4 py-2 rounded-t-lg flex items-center gap-2 font-medium text-sm transition-colors ${activeTab==='shader' ? 'bg-[#202c33] text-green-400 border-t border-x border-slate-700' : 'text-slate-500'}`}><Palette size={16}/> Shaders</button>
            <button onClick={()=>setActiveTab('apk-signer')} className={`px-4 py-2 rounded-t-lg flex items-center gap-2 font-medium text-sm transition-colors ${activeTab==='apk-signer' ? 'bg-[#202c33] text-green-400 border-t border-x border-slate-700' : 'text-slate-500'}`}><ShieldCheck size={16}/> APK Signer</button>
        </div>

        <div className="bg-[#202c33] p-6 rounded-lg border border-slate-700 max-w-2xl">
            <div className="space-y-4">
                <h3 className="text-white font-bold">{activeTab === 'ui-layout' ? 'Godot UI Generator' : activeTab === 'shader' ? 'ShaderFX Generator' : 'KeyStore Generator'}</h3>
                <textarea className="w-full bg-[#111b21] p-3 rounded text-white h-32" placeholder="Describe requirements..." />
            </div>

            <div className="mt-6">
                <button onClick={handleGenerate} disabled={loading} className="bg-green-600 w-full py-3 rounded font-bold text-white hover:bg-green-500 transition-colors flex items-center justify-center gap-2">
                    {loading ? 'Generating...' : <><Download size={18}/> GENERATE ASSET</>}
                </button>
            </div>

            {result && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 font-mono text-sm">
                    {result}
                </div>
            )}
        </div>
    </div>
  );
};
