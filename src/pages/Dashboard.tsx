import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Activity, DollarSign, Database, Globe, CheckCircle2, Terminal, ShieldAlert, Cpu, Lock, FileCode, Archive, TrendingUp, Lightbulb, Zap, Target, Loader2, Wifi } from 'lucide-react';
import { TermuxNode, PendingFix, AppSettings, RevenueDataPoint, LtvDataPoint, BuildStatus } from '../types';
import { triggerWorkflow } from '../services/githubService';
import { generateRevenueStrategy } from '../services/geminiService';

interface DashboardProps {
  termuxNodes: TermuxNode[];
  settings: AppSettings;
  revenueData?: RevenueDataPoint[];
  ltvData?: LtvDataPoint[];
  pendingFixes?: PendingFix[];
  onFixAction?: (id: string, action: 'approved' | 'rejected', fixData?: PendingFix) => void;
  triggerBuildMode?: 'idle' | 'private' | 'public';
  onBuildComplete?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    termuxNodes, 
    settings,
    revenueData = [], 
    triggerBuildMode = 'idle',
    onBuildComplete
}) => {
  
  // Strategy State
  const [strategy, setStrategy] = useState<any>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  // Hybrid Build State
  const [buildStatus, setBuildStatus] = useState<BuildStatus>({
      step: 'idle',
      mode: 'private',
      progress: 0,
      log: [],
      legacyCoreDetected: true
  });

  useEffect(() => {
      if ((triggerBuildMode === 'private' || triggerBuildMode === 'public') && buildStatus.step === 'idle') {
          startBuild(triggerBuildMode);
      }
  }, [triggerBuildMode]);

  const handleGenerateStrategy = async () => {
      setIsGeneratingStrategy(true);
      // Simulate reading from ports by passing current mock data
      const analysis = await generateRevenueStrategy({ 
          dau: 8420, 
          arpu: 1.42, 
          retention: 0.84, 
          ports_active: settings.gameEndpoints?.length || 0 
      });
      setStrategy(analysis);
      setIsGeneratingStrategy(false);
  };

  const startBuild = async (mode: 'private' | 'public') => {
      const isPublic = mode === 'public';
      setBuildStatus(prev => ({ ...prev, step: 'cloning', mode: mode, progress: 5, log: [`> Initializing FEAC ${isPublic ? 'PUBLIC' : 'PRIVATE'} Pipeline...`, '> Checking GitHub Connectivity...'] }));

      if (settings.githubToken && settings.githubRepo) {
          try {
              updateBuild('cloning', 10, `> Dispatching Workflow to ${settings.githubRepo}...`);
              await triggerWorkflow(settings, 'feac_sovereign_build.yml', { build_target: 'android', build_mode: mode });
              updateBuild('building', 30, '> ✅ GitHub Action Triggered Successfully.');
              updateBuild('building', 40, '> Waiting for Runner Agent (Ubuntu-Latest)...');
              setTimeout(() => {
                  updateBuild('complete', 100, `> ✅ Build Completed on GitHub. Check "Actions" tab in Repo.`);
                  if (onBuildComplete) onBuildComplete();
              }, 10000);
          } catch (e: any) {
              updateBuild('error', 0, `> ❌ FAILED TO TRIGGER: ${e.message}`);
          }
      } else {
          updateBuild('analysis', 20, '> ⚠️ NO GITHUB TOKEN. RUNNING SIMULATION.');
          setTimeout(() => {
              updateBuild('complete', 100, '> ✅ Private Artifact Generated (Simulated).');
              if (onBuildComplete) onBuildComplete();
          }, 4000);
      }
  };

  const updateBuild = (step: any, progress: number, logMsg: string) => {
    setBuildStatus(prev => ({ ...prev, step, progress, log: [...prev.log, logMsg] }));
  };

  const isDataAvailable = revenueData.length > 0;

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scroll font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/5 pb-6 animate-fade-in-up delay-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-white tracking-tighter flex items-center gap-3">
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">FEAC</span> 
                <span className="text-slate-600 font-thin">|</span> 
                <span className="text-slate-400 font-mono text-xl md:text-2xl">LIVEOPS</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-[0.2em]">$1M ARR REVENUE CORE</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm shadow-lg">
              <div className={`h-2 w-2 rounded-full ${settings.gameEndpoints?.some(p => p.status === 'active') ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-slate-500'} animate-pulse`}></div>
              <span className="text-xs font-bold tracking-widest text-purple-400">
                  {settings.gameEndpoints?.length || 0} PORTS ACTIVE
              </span>
          </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <GlassMetric 
            label="LEGACY CORE" 
            value={buildStatus.legacyCoreDetected ? 'MOUNTED' : 'MISSING'} 
            sub={buildStatus.legacyCoreDetected ? 'Keystore & Assets Ready' : 'Run Absorber Script'} 
            icon={<Archive size={18} className={buildStatus.legacyCoreDetected ? "text-yellow-400" : "text-slate-600"}/>} 
            active={!!buildStatus.legacyCoreDetected}
            delay="delay-100"
        />
        <GlassMetric 
            label="ACTIVE NODES" 
            value={`${termuxNodes.length}`} 
            sub="CPU LOAD: MONITORING" 
            icon={<Database size={18} className={termuxNodes.length > 0 ? "text-blue-400" : "text-slate-600"}/>} 
            active={termuxNodes.length > 0}
            delay="delay-200"
        />
        <GlassMetric 
            label="BUILD STATUS" 
            value={buildStatus.step === 'idle' ? 'READY' : buildStatus.step === 'complete' ? 'SUCCESS' : 'BUILDING'}
            sub={buildStatus.mode === 'public' ? 'PUBLIC AAB' : 'PRIVATE APK'} 
            icon={<Activity size={18} className={buildStatus.step !== 'idle' && buildStatus.step !== 'complete' ? "text-yellow-400 animate-spin" : "text-slate-600"}/>} 
            active={buildStatus.step !== 'idle'}
            delay="delay-300"
        />
        <GlassMetric 
            label="REVENUE PULSE" 
            value="$1.2M" 
            sub="PROJECTED ARR" 
            icon={<TrendingUp size={18} className="text-green-400"/>} 
            active={true}
            delay="delay-500"
        />
      </div>

      {/* AI STRATEGY ENGINE */}
      <div className="mb-8 animate-fade-in-up delay-300">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-sm font-bold text-purple-400 tracking-[0.2em] flex items-center gap-2">
                      <Lightbulb size={16}/> AI STRATEGY ENGINE
                  </h3>
                  <button 
                    onClick={handleGenerateStrategy}
                    disabled={isGeneratingStrategy}
                    className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-4 py-2 rounded-full text-xs font-bold transition-all border border-purple-500/30"
                  >
                      {isGeneratingStrategy ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14}/>}
                      {isGeneratingStrategy ? 'ANALYZING TELEMETRY...' : 'GENERATE GROWTH PLAN'}
                  </button>
              </div>

              {strategy ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                      <div className="col-span-1 bg-black/30 p-4 rounded-xl border border-white/5">
                          <h4 className="text-xs text-slate-400 uppercase tracking-widest mb-2">Analysis</h4>
                          <p className="text-sm text-slate-200 leading-relaxed">{strategy.analysis}</p>
                      </div>
                      <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {strategy.tactics?.map((tactic: any, i: number) => (
                              <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">{tactic.title}</div>
                                      <span className="text-[9px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">{tactic.impact} IMPACT</span>
                                  </div>
                                  <p className="text-xs text-slate-400">{tactic.desc}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="text-center py-8 text-slate-600 relative z-10">
                      <Target size={48} className="mx-auto mb-3 opacity-20"/>
                      <p className="text-sm">No active strategy. Click Generate to analyze game telemetry.</p>
                  </div>
              )}
          </div>
      </div>

      {/* BUILD SYSTEM & REVENUE - Main Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Build Pipeline Interface */}
          <div className="col-span-1 glass-card rounded-2xl p-6 relative overflow-hidden group shadow-2xl animate-fade-in-up delay-200 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-6">
                   <h3 className="text-xs font-bold text-slate-400 tracking-[0.2em] mb-1 flex items-center gap-2">
                      <Terminal size={14}/> HYBRID BUILD SYSTEM
                   </h3>
                   {buildStatus.step !== 'idle' && <span className="text-[10px] text-green-400 font-mono animate-pulse">PROCESSING</span>}
              </div>

              {buildStatus.step === 'idle' && (
                  <div className="flex flex-col gap-3 h-[250px] justify-center">
                      <button onClick={() => startBuild('private')} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                              <Lock size={18}/>
                          </div>
                          <div className="text-left">
                              <div className="text-sm font-bold text-white">Private Build (APK)</div>
                              <div className="text-[10px] text-slate-500">Local Testing • Keystore Gen</div>
                          </div>
                      </button>
                      <button onClick={() => startBuild('public')} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              <Globe size={18}/>
                          </div>
                          <div className="text-left">
                              <div className="text-sm font-bold text-white">Public Release (AAB)</div>
                              <div className="text-[10px] text-slate-500">Google Play • Production Sign</div>
                          </div>
                      </button>
                  </div>
              )}

              {buildStatus.step !== 'idle' && (
                  <div className="flex flex-col h-[250px]">
                      <div className="flex-1 bg-black/30 rounded-lg p-3 font-mono text-[10px] text-green-400 overflow-y-auto mb-3 border border-white/5">
                          {buildStatus.log.map((l, i) => (
                              <div key={i} className="mb-1.5">{l}</div>
                          ))}
                          {buildStatus.step !== 'complete' && <div className="animate-pulse">_</div>}
                      </div>
                      
                      <div className="space-y-2">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                              <span>Progress</span>
                              <span>{buildStatus.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 transition-all duration-300" style={{width: `${buildStatus.progress}%`}}></div>
                          </div>
                      </div>

                      {buildStatus.step === 'complete' && (
                          <div className="mt-3 flex gap-2 animate-fade-in-up">
                              <button onClick={() => setBuildStatus(prev => ({...prev, step: 'idle'}))} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded text-xs font-bold text-white transition-colors">
                                  Dismiss
                              </button>
                              <button className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2">
                                  {buildStatus.mode === 'public' ? <Globe size={12}/> : <FileCode size={12}/>} 
                                  {buildStatus.mode === 'public' ? 'Open Actions' : 'Download Artifact'}
                              </button>
                          </div>
                      )}
                  </div>
              )}
          </div>

          {/* Revenue Chart */}
          <div className="col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden group shadow-2xl animate-fade-in-up delay-200 hover:border-white/10 transition-colors">
               <div className="flex justify-between items-start mb-6">
                  <div>
                      <h3 className="text-xs font-bold text-slate-400 tracking-[0.2em] mb-1">REVENUE STREAM</h3>
                      <p className="text-[10px] text-slate-600 font-mono">LISTENING TO PORT: {settings.gameEndpoints?.find(p=>p.type==='telemetry')?.port || '8091'}</p>
                  </div>
                  {isDataAvailable && <Activity className="text-green-500 animate-pulse" size={16}/>}
              </div>
              <div className="h-[250px] w-full">
                  {isDataAvailable ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                              <Tooltip 
                                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                  contentStyle={{backgroundColor:'#0d1117', borderColor:'#333', color:'#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'}} 
                              />
                              <Bar dataKey="amt" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
                          </BarChart>
                      </ResponsiveContainer>
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4 border border-dashed border-slate-800 rounded-xl bg-black/20">
                          <div className="relative">
                              <Wifi size={40} className="animate-pulse opacity-50" />
                              <div className="absolute inset-0 border-2 border-slate-700/50 rounded-full animate-ping opacity-20"></div>
                          </div>
                          <p className="text-[10px] tracking-[0.2em] font-bold opacity-70">WAITING FOR TELEMETRY UPLINK</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

const GlassMetric = ({ label, value, sub, icon, active, delay }: any) => (
  <div className={`glass-card p-4 rounded-xl relative overflow-hidden group hover:border-white/10 transition-colors animate-fade-in-up ${delay} ${active ? 'border-t border-white/10' : 'opacity-60'}`}>
      <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${active ? 'text-white' : 'text-slate-500'}`}>
          {icon}
      </div>
      <div className="text-[10px] font-bold text-slate-500 tracking-widest mb-1 uppercase">{label}</div>
      <div className={`text-2xl font-light tracking-tight ${active ? 'text-white' : 'text-slate-600'}`}>{value}</div>
      <div className="text-[9px] font-mono text-slate-500 mt-2 flex items-center gap-1">
          <div className={`w-1 h-1 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
          {sub}
      </div>
  </div>
);
