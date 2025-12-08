import React, { useEffect, useState } from 'react';
import { Coins, Battery, BarChart3 } from 'lucide-react';

export default function TokenEconomy() {
    const [balance, setBalance] = useState(0);
    const apiKey = localStorage.getItem('feac_api_key') || "";

    useEffect(() => {
        fetch("http://localhost:8000/v1/billing/balance", {
            headers: { "x-api-key": apiKey }
        })
            .then(r => r.json())
            .then(d => setBalance(Number(d.balance || 0)));
    }, []);

    return (
        <div className="p-6 text-white h-full">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Coins className="text-yellow-400" /> Token Economy
            </h1>

            <div className="bg-[#0f172a] border border-yellow-500/40 rounded-xl p-6">
                <h3 className="text-yellow-300 text-xl font-bold mb-2">Token Balance</h3>
                <div className="text-4xl font-mono text-yellow-400">{balance}</div>

                <p className="text-yellow-200/70 mt-3">
                    • Chat: 1 token  
                    • Short Reasoning: 2 token  
                    • Medium: 5 token  
                    • Long: 10 token  
                    • Code Generation: 10 token per block  
                </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-[#111b21] p-4 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 text-sm mb-2">Usage Analytics</h3>
                    <div className="text-xl text-blue-400 flex items-center gap-2">
                        <BarChart3 size={20}/> Coming Soon
                    </div>
                </div>

                <div className="bg-[#111b21] p-4 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 text-sm mb-2">Tier</h3>
                    <div className="text-xl text-green-400 flex items-center gap-2">
                        <Battery size={20}/> Free Tier
                    </div>
                </div>
            </div>
        </div>
    );
}
