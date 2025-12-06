import React, { useEffect } from 'react';
import { CircleUser, LogOut, Download, Hexagon, Menu } from 'lucide-react';
import { USER_PHONE } from '../constants';
import { connectFEAC } from '../lib/feac-runtime';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onLogout: () => void;
  onExport?: () => void;
  version: string;
  isChatActive: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar, onLogout, onExport, version, isChatActive }) => {
  
  // FEAC Neural Core Injection
  useEffect(() => {
      connectFEAC();
  }, []);

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#050505] text-[#ececf1] font-sans bg-grid-pattern">
      
      {/* SIDEBAR */}
      <div className={`${isChatActive ? 'hidden md:flex' : 'flex'} w-full md:w-[260px] flex-col bg-[#171717] h-full transition-all duration-300 z-30 flex-shrink-0 border-r border-white/5`}>
        
        <div className="p-3">
          <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[#212121] cursor-pointer transition-colors border border-white/10 mb-4 text-white">
             <Hexagon className="w-4 h-4 text-white" />
             <span className="text-sm font-medium">New Command</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll px-2">
          <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-widest">Navigation</div>
          {sidebar}
        </div>

        <div className="border-t border-white/10 p-2 bg-[#171717]">
           <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[#212121] cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">F</div>
              <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-bold truncate text-gray-200">User {USER_PHONE}</div>
                 <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    v{version} (Neural)
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 </div>
              </div>
              <button onClick={onLogout} className="text-gray-500 hover:text-white"><LogOut size={16} /></button>
           </div>
           {onExport && (
              <button onClick={onExport} className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white py-2 border border-white/5 rounded hover:bg-white/5 transition-all">
                  <Download size={12} /> Termux Script
              </button>
           )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`${!isChatActive ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-transparent relative h-full w-full min-w-0`}>
        {children}
      </div>
    </div>
  );
};
