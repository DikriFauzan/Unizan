import React, { useState } from 'react';
import { Shield, Crown, Zap, Activity } from 'lucide-react';
import { AppSettings } from '../types';

interface Props { settings: AppSettings; }

export const Billing: React.FC<Props> = ({ settings }) => {
  // HARDCODED OWNER BYPASS
  const isOwner = true; 

  return (
    <div className="p-6 h-full text-white">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
           <Shield className="text-green-400"/> Sovereign Command
        </h1>

        <div className="mb-8 bg-gradient-to-r from-green-900/60 to-black border border-green-500/50 p-6 rounded-xl flex items-center gap-6">
            <div className="bg-green-500/20 p-4 rounded-full border border-green-500/50">
                <Crown size={48} className="text-green-400" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-green-400 tracking-wider">SUPERKEY ACTIVE</h2>
                <p className="text-sm text-green-100/80 mt-1">
                    Hash: <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-green-300">FEAC-SVR-*******</span>
                </p>
                <p className="text-sm text-green-100/60 mt-2">
                    System operating in Sovereign Mode. All billing limits bypassed.
                </p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111b21] p-4 rounded-lg border border-slate-700">
                <h3 className="text-slate-400 text-sm mb-2">Emergent Engine</h3>
                <div className="text-xl text-green-400 flex items-center gap-2"><Zap size={20}/> ONLINE</div>
            </div>
            <div className="bg-[#111b21] p-4 rounded-lg border border-slate-700">
                <h3 className="text-slate-400 text-sm mb-2">Billing Gateway</h3>
                <div className="text-xl text-yellow-400 flex items-center gap-2"><Activity size={20}/> BYPASSED</div>
            </div>
        </div>
    </div>
  );
};
