import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, DollarSign, Users, Database, Play, Settings, Globe, Lock, Terminal, CheckCircle2, Download, HardDrive, Cloud } from 'lucide-react';
import { MOCK_REVENUE_DATA, MOCK_TERMUX_NODES } from '../constants';

export const Dashboard = ({ autoBuildType }) => {
  const [buildStatus, setBuildStatus] = useState({ step: 'idle', progress: 0, logs: ['Ready.'] });
  const [mode, setMode] = useState('private');

  useEffect(() => {
      if (autoBuildType) startBuild(autoBuildType);
  }, [autoBuildType]);

  const startBuild = (type) => {
      setMode(type);
      setBuildStatus({ step: 'init', progress: 5, logs: ['> Initializing Pipeline...', '> Connecting to Termux...'] });
      
      setTimeout(() => updateLog(20, '> Compiling NeoEngine Assets...'), 1500);
      setTimeout(() => updateLog(50, '> Building Android Binary (Gradle)...'), 3500);
      setTimeout(() => updateLog(80, '> Signing with feac-private.keystore...'), 5500);
      setTimeout(() => {
          setBuildStatus(prev => ({ ...prev, step: 'done', progress: 100, logs: [...prev.logs, '> SUCCESS: Artifact Generated.', '> Uploaded to Secure Vault.'] }));
      }, 7500);
  };

  const updateLog = (prog, msg) => {
      setBuildStatus(prev => ({ ...prev, progress: prog, logs: [...prev.logs, msg] }));
  };

  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6 flex gap-2"><Activity className="text-[#00a884]"/> Command Center</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#202c33] p-4 rounded border border-slate-700">
              <div className="text-xs text-gray-400">Revenue</div>
              <div className="text-2xl font-mono text-green-400">$1.2M</div>
          </div>
          <div className="bg-[#202c33] p-4 rounded border border-slate-700">
              <div className="text-xs text-gray-400">Active Nodes</div>
              <div className="text-2xl font-mono text-blue-400">{MOCK_TERMUX_NODES.length}</div>
          </div>
      </div>

      {/* Build Pipeline */}
      <div className="bg-[#202c33] p-4 rounded border border-slate-700 mb-6">
          <div className="flex justify-between mb-4">
              <h3 className="font-bold flex gap-2"><Settings/> Build Pipeline</h3>
              <div className="flex gap-2">
                  <button onClick={() => startBuild('private')} className="bg-red-600 text-xs px-3 py-1 rounded font-bold">PRIVATE</button>
                  <button onClick={() => startBuild('public')} className="bg-blue-600 text-xs px-3 py-1 rounded font-bold">PUBLIC</button>
              </div>
          </div>
          <div className="bg-black p-2 rounded font-mono text-xs text-green-500 h-32 overflow-y-auto mb-2 border border-slate-800">
              {buildStatus.logs.map((l,i) => <div key={i}>{l}</div>)}
          </div>
          <div className="h-2 bg-slate-700 rounded overflow-hidden mb-4">
              <div className="h-full bg-[#00a884] transition-all duration-500" style={{width: buildStatus.progress + '%'}}></div>
          </div>
          {buildStatus.step === 'done' && (
              <button className="w-full bg-[#00a884] text-black font-bold py-3 rounded flex justify-center gap-2 animate-pulse">
                  <Download/> DOWNLOAD {mode === 'private' ? 'APK' : 'AAB'}
              </button>
          )}
      </div>

      {/* Infrastructure */}
      <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#202c33] p-4 rounded">
              <h3 className="font-bold mb-2 flex gap-2"><Terminal size={16}/> Termux Bridge</h3>
              <div className="text-xs text-gray-400">Status: <span className="text-green-400">ONLINE</span></div>
              <div className="text-xs font-mono mt-2 bg-black p-2 rounded">ws://localhost:8080 connected</div>
          </div>
          <div className="bg-[#202c33] p-4 rounded">
              <h3 className="font-bold mb-2 flex gap-2"><Globe size={16}/> Cloud Storage</h3>
              <div className="text-xs text-gray-400">Sync: <span className="text-blue-400">ACTIVE</span></div>
              <div className="text-xs font-mono mt-2">Target: muhammadilyasfauzan7@gmail.com</div>
          </div>
      </div>
    </div>
  );
};
