import React from 'react';
import { Shield, Crown } from 'lucide-react';
import { AppSettings } from '../types';
import { USER_PHONE } from '../constants';

interface Props { settings: AppSettings; }

export const Billing: React.FC<Props> = () => {
  // HARDCODED OWNER BYPASS
  const isOwner = USER_PHONE === '085119887826'; 

  if (!isOwner) return <div>Access Restricted.</div>;

  return (
    <div className="p-6 h-full text-white">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
           <Shield className="text-yellow-400"/> Sovereign Status
        </h1>

        <div className="mb-8 bg-gradient-to-r from-yellow-900/60 to-black border border-yellow-500/50 p-6 rounded-xl flex items-center gap-6">
            <div className="bg-yellow-500/20 p-4 rounded-full border border-yellow-500/50">
                <Crown size={48} className="text-yellow-400" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-yellow-400 tracking-wider">ARCHITECT ACCESS GRANTED</h2>
                <p className="text-sm text-yellow-100/80 mt-1">
                    Identity: <span className="font-mono bg-black/50 px-2 py-0.5 rounded text-yellow-300">{USER_PHONE}</span>
                </p>
                <p className="text-sm text-yellow-100/60 mt-2">
                    Billing modules bypassed. Unlimited access active.
                </p>
            </div>
        </div>
        
        <div className="text-center text-xs text-slate-500 font-mono mt-10">
            STRIPE: DISCONNECTED • PAYPAL: DISCONNECTED • MODE: SOVEREIGN
        </div>
    </div>
  );
};
