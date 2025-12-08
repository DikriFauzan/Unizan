import React from 'react';
import { CreditCard, Check, Shield, Crown, Zap, Server } from 'lucide-react';
import { AppSettings } from '../types';
import { USER_PHONE } from '../constants';

interface Props {
  settings: AppSettings;
}

export const Billing: React.FC<Props> = ({ settings }) => {
  // HARDCODED SOVEREIGN CHECK FOR YOUR ID
  const isOwner = USER_PHONE === '085119887826'; 

  return (
    <div className="p-6 h-full overflow-y-auto custom-scroll text-white">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
           <Shield className="text-yellow-400"/> Sovereign Status
        </h1>

        {/* OWNER BANNER */}
        <div className="mb-8 bg-gradient-to-r from-yellow-900/60 to-black border border-yellow-500/50 p-6 rounded-xl flex items-center gap-6 shadow-[0_0_30px_rgba(234,179,8,0.15)] animate-fade-in-up">
            <div className="bg-yellow-500/20 p-4 rounded-full border border-yellow-500/50">
                <Crown size={48} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-yellow-400 tracking-wider">ARCHITECT ACCESS GRANTED</h2>
                <p className="text-sm text-yellow-100/80 mt-1 max-w-xl">
                    Identity Verified: <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-yellow-300">{USER_PHONE}</span>
                </p>
                <p className="text-sm text-yellow-100/60 mt-2">
                    Billing modules have been bypassed. You have unlimited access to Neural Nodes, Storage Vaults, and API Gateways.
                </p>
            </div>
            <div className="ml-auto flex flex-col items-end gap-2">
                <div className="bg-yellow-500 text-black font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    LIFETIME SOVEREIGN
                </div>
                <div className="text-[10px] text-yellow-500 font-mono">NO RECURRING FEES</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto opacity-50 pointer-events-none grayscale">
            {/* DUMMY CARDS (DISABLED) */}
            <div className="bg-[#111b21] border border-slate-700 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-400">Standard</h3>
                <div className="text-3xl font-bold my-4">$0</div>
                <button className="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-bold">Disabled</button>
            </div>
            <div className="bg-[#111b21] border border-slate-700 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-400">Pro</h3>
                <div className="text-3xl font-bold my-4">$29</div>
                <button className="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-bold">Disabled</button>
            </div>
            <div className="bg-[#111b21] border border-slate-700 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-400">Enterprise</h3>
                <div className="text-3xl font-bold my-4">$99</div>
                <button className="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-bold">Disabled</button>
            </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-500 font-mono">
            PAYMENT GATEWAYS: <span className="text-red-500 line-through">STRIPE</span> / <span className="text-red-500 line-through">PAYPAL</span> • OVERRIDE: <span className="text-green-500">ROOT_ACCESS</span>
        </div>
    </div>
  );
};
