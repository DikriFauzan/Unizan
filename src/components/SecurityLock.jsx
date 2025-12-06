import React, { useState } from 'react';
import { ShieldCheck, Fingerprint } from 'lucide-react';

export const SecurityLock = ({ onUnlock }) => {
  return (
    <div className="h-screen w-screen bg-[#0b141a] flex flex-col items-center justify-center text-white">
      <ShieldCheck className="w-16 h-16 text-[#00a884] mb-4 animate-pulse" />
      <h1 className="text-2xl font-bold mb-8">FEAC Locked</h1>
      <button onClick={onUnlock} className="bg-[#00a884] text-black px-8 py-4 rounded-full font-bold flex gap-2 items-center active:scale-95 transition">
        <Fingerprint size={24}/> TAP TO UNLOCK
      </button>
      <p className="mt-4 text-xs text-gray-500">Biometric Simulation Active</p>
    </div>
  );
};
