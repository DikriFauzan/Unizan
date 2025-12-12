import React from 'react';
import { CreditCard, Check } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';

export default function Billing() {
  const handleUpgrade = async (planId) => {
    try {
      // Mock User ID - in real app get from Auth Context
      const userId = 'user-uuid-placeholder'; 
      const { data } = await axios.post(`${API_URL}/billing/checkout`, { 
          plan: planId, 
          userId 
      });
      window.location.href = data.url; // Redirect to Stripe
    } catch (e) {
      alert("Billing Error: " + e.message);
    }
  };

  return (
    <div className="p-10 text-white font-sans">
       <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <CreditCard className="text-green-400" /> Subscription Plans
       </h1>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
           {/* FREE */}
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h2 className="text-xl font-bold">Developer</h2>
               <div className="text-3xl font-bold my-4">$0 <span className="text-sm font-normal text-slate-400">/mo</span></div>
               <ul className="space-y-3 mb-8 text-sm text-slate-300">
                   <li className="flex gap-2"><Check size={16} className="text-green-400"/> 1,000 req/mo</li>
                   <li className="flex gap-2"><Check size={16} className="text-green-400"/> Basic Support</li>
               </ul>
               <button disabled className="w-full py-2 bg-slate-700 rounded font-bold text-slate-400">Current Plan</button>
           </div>

           {/* PRO */}
           <div className="bg-slate-800 p-6 rounded-xl border border-blue-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl">RECOMMENDED</div>
               <h2 className="text-xl font-bold text-blue-400">Pro Scale</h2>
               <div className="text-3xl font-bold my-4">$29 <span className="text-sm font-normal text-slate-400">/mo</span></div>
               <ul className="space-y-3 mb-8 text-sm text-slate-300">
                   <li className="flex gap-2"><Check size={16} className="text-blue-400"/> 100,000 req/mo</li>
                   <li className="flex gap-2"><Check size={16} className="text-blue-400"/> Priority Support</li>
                   <li className="flex gap-2"><Check size={16} className="text-blue-400"/> Video Generation</li>
               </ul>
               <button 
                 onClick={() => handleUpgrade('price_pro_plan_id')}
                 className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors"
               >
                 Upgrade to Pro
               </button>
           </div>

           {/* ENTERPRISE */}
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h2 className="text-xl font-bold">Sovereign</h2>
               <div className="text-3xl font-bold my-4">$99 <span className="text-sm font-normal text-slate-400">/mo</span></div>
               <ul className="space-y-3 mb-8 text-sm text-slate-300">
                   <li className="flex gap-2"><Check size={16} className="text-green-400"/> Unlimited Quota</li>
                   <li className="flex gap-2"><Check size={16} className="text-green-400"/> Dedicated Instance</li>
               </ul>
               <button className="w-full py-2 bg-slate-600 hover:bg-slate-500 rounded font-bold transition-colors">Contact Sales</button>
           </div>
       </div>
    </div>
  );
}
