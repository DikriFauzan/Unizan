import React, { useState } from 'react';
import { CreditCard, Check, Zap, Shield, Rocket } from 'lucide-react';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
}

export const Billing: React.FC<Props> = ({ settings }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
      if (!settings.billingApiUrl) {
          alert("Please configure Billing API URL in Settings first!");
          return;
      }
      setLoading(true);
      try {
          // Call backend to get Stripe URL
          const response = await fetch(`${settings.billingApiUrl}/billing/checkout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plan, userId: 'user-085119887826' }) // Hardcoded owner ID for now
          });
          const data = await response.json();
          if (data.url) {
              window.open(data.url, '_blank');
          } else {
              alert("Checkout failed: " + (data.error || "Unknown error"));
          }
      } catch (e) {
          alert("Connection Error. Is the Backend Server running?");
      }
      setLoading(false);
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scroll text-white">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
           <CreditCard className="text-green-400"/> Subscription Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-[#111b21] border border-slate-700 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-400">Developer</h3>
                <div className="text-3xl font-bold my-4">$0 <span className="text-sm font-normal text-slate-500">/mo</span></div>
                <div className="flex-1 space-y-3 mb-6">
                    <Feature text="1,000 API Calls/mo" />
                    <Feature text="Basic Code Scanning" />
                    <Feature text="Community Support" />
                </div>
                <button className="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-bold cursor-not-allowed">Current Plan</button>
            </div>

            {/* Pro Tier */}
            <div className="bg-[#202c33] border border-blue-500 rounded-2xl p-6 flex flex-col relative transform scale-105 shadow-2xl">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2"><Zap size={18}/> Pro Scale</h3>
                <div className="text-3xl font-bold my-4">$29 <span className="text-sm font-normal text-slate-400">/mo</span></div>
                <div className="flex-1 space-y-3 mb-6">
                    <Feature text="100,000 API Calls/mo" />
                    <Feature text="Veo 3.1 Video Gen" />
                    <Feature text="Priority Auto-Fix" />
                    <Feature text="Private APK Builds" />
                </div>
                <button 
                    onClick={() => handleSubscribe('price_pro_plan_id')} 
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg"
                >
                    {loading ? 'Processing...' : 'Upgrade to Pro'}
                </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#111b21] border border-green-500/50 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-green-400 flex items-center gap-2"><Shield size={18}/> Sovereign</h3>
                <div className="text-3xl font-bold my-4">$99 <span className="text-sm font-normal text-slate-500">/mo</span></div>
                <div className="flex-1 space-y-3 mb-6">
                    <Feature text="Unlimited Quota" />
                    <Feature text="Dedicated Nodes" />
                    <Feature text="Sovereign Vault Sync" />
                    <Feature text="24/7 Priority Support" />
                </div>
                <button className="w-full py-3 bg-green-900/30 text-green-400 border border-green-500/50 rounded-lg font-bold hover:bg-green-900/50 transition-colors">Contact Sales</button>
            </div>
        </div>
        
        <div className="mt-12 bg-black/30 p-6 rounded-xl border border-slate-800 text-center">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Revenue Core Status</h4>
            <div className="flex justify-center items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${settings.billingApiUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Backend: {settings.billingApiUrl ? 'CONFIGURED' : 'DISCONNECTED'}
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Stripe Gateway: READY
                </div>
            </div>
        </div>
    </div>
  );
};

const Feature = ({text}: {text: string}) => (
    <div className="flex items-center gap-3 text-sm text-slate-300">
        <div className="bg-green-500/10 p-1 rounded-full"><Check size={12} className="text-green-400"/></div>
        {text}
    </div>
);
