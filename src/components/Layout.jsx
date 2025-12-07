import React from 'react';
import { CircleUser, LogOut, Lock, Download } from 'lucide-react';
import { USER_PHONE } from '../constants';

export const Layout = ({ children, sidebar, onLogout, version }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b141a] text-[#e9edef] relative">
      <div className="z-10 flex w-full h-full max-w-[1600px] mx-auto shadow-2xl overflow-hidden">
        <div className="w-16 md:w-[300px] flex flex-col bg-[#111b21] border-r border-[#202c33] h-full">
          <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center"><CircleUser/></div>
              <div className="hidden md:block">
                 <span className="block font-bold text-sm">{USER_PHONE}</span>
                 <span className="flex items-center gap-1 text-[10px] text-green-400"><Lock size={10}/> Private</span>
              </div>
            </div>
            <button onClick={onLogout}><LogOut size={20}/></button>
          </div>
          <div className="flex-1 overflow-y-auto">{sidebar}</div>
          <div className="h-8 bg-[#0b141a] flex items-center justify-center text-xs text-gray-500">FEAC {version}</div>
        </div>
        <div className="flex-1 flex flex-col bg-[#0b141a] relative h-full bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-blend-overlay">
          {children}
        </div>
      </div>
    </div>
  );
};
