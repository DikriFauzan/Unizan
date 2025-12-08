import React from 'react';
import { Shield, Key, Lock, Server, Zap } from 'lucide-react';

export default function SuperKeyCenter() {
    const superkey = localStorage.getItem('feac_superkey') || "FEAC-SVR-********";

    return (
        <div className="p-6 text-white h-full">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Shield className="text-green-400" /> SuperKey Center
            </h1>

            <div className="bg-gradient-to-br from-green-900/30 to-black border border-green-500/30 p-6 rounded-xl mb-8">
                <h2 className="text-xl text-green-400 font-bold mb-2">Owner SuperKey</h2>
                <p className="font-mono bg-black/60 p-3 rounded border border-green-400/40 text-lg">
                    {superkey}
                </p>
                <p className="text-sm text-green-300/70 mt-2">
                    • SuperKey memiliki akses penuh (God Mode)  
                    • Token bypass  
                    • Build unlimited  
                    • Reasoning unlimited
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111b21] p-4 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 text-sm mb-2">Emergent Engine</h3>
                    <div className="text-xl text-green-400 flex items-center gap-2">
                        <Zap size={20}/> ONLINE
                    </div>
                </div>

                <div className="bg-[#111b21] p-4 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 text-sm mb-2">Flowith Agent</h3>
                    <div className="text-xl text-yellow-400 flex items-center gap-2">
                        <Server size={20}/> ACTIVE
                    </div>
                </div>
            </div>
        </div>
    );
}
