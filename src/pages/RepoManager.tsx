import React, { useState, useEffect } from 'react';
import { GitBranch, Folder, FileCode, Save, RefreshCw, UploadCloud, Github, AlertTriangle, Wand2, Loader2, Check, ArrowLeft, XCircle } from 'lucide-react';
import { AppSettings } from '../types';
import Editor from '@monaco-editor/react';
import { fetchRepoTree, fetchFileContent, commitFileToGithub, GithubFile } from '../services/githubService';
import { analyzeCode, applyAutoFix, CodeFix } from '../services/geminiService';

interface Props {
  settings: AppSettings;
}

export const RepoManager: React.FC<Props> = ({ settings }) => {
  const [files, setFiles] = useState<GithubFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("// Select a file to load...");
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fixes, setFixes] = useState<CodeFix[]>([]);
  const [pendingFixedContent, setPendingFixedContent] = useState<string | null>(null);

  useEffect(() => {
      if (settings.githubRepo && settings.githubToken) loadTree();
  }, [settings.githubRepo]);

  const loadTree = async () => {
      setIsLoading(true);
      const tree = await fetchRepoTree(settings);
      setFiles(tree);
      setIsLoading(false);
  };

  const handleFileClick = async (file: GithubFile) => {
      if (file.type === 'file') {
          setIsLoading(true);
          setActiveFile(file.path);
          const content = await fetchFileContent(settings, file.path);
          setFileContent(content);
          setIsDirty(false);
          setFixes([]); 
          setPendingFixedContent(null);
          setIsLoading(false);
      } else {
          const subTree = await fetchRepoTree(settings, file.path);
          setFiles(prev => [...prev.filter(p => !p.path.startsWith(file.path + '/')), ...subTree]);
      }
  };

  const handleSave = async () => {
      if (!activeFile) return;
      setIsLoading(true);
      try {
          await commitFileToGithub(settings, activeFile, fileContent, `FEAC Update: ${activeFile}`);
          setIsDirty(false);
          alert("✅ Committed to GitHub successfully.");
      } catch (e) {
          alert("❌ Commit Failed. Check Token.");
      }
      setIsLoading(false);
  };

  const handleScan = async () => {
      if (!activeFile) return;
      setIsAnalyzing(true);
      setFixes([]);
      setPendingFixedContent(null);
      
      // 1. Analyze
      const detectedFixes = await analyzeCode(fileContent, activeFile);
      setFixes(detectedFixes);
      
      // 2. Propose Fix (Do not apply yet)
      if (detectedFixes.length > 0) {
          const proposedContent = await applyAutoFix(fileContent, detectedFixes);
          setPendingFixedContent(proposedContent);
      }
      
      setIsAnalyzing(false);
  };

  const confirmFix = () => {
      if(pendingFixedContent) {
          setFileContent(pendingFixedContent);
          setPendingFixedContent(null);
          setIsDirty(true);
      }
  };

  if (!settings.githubRepo || !settings.githubToken) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Github size={48} className="mb-4 opacity-50"/>
              <h2 className="text-xl font-bold text-white">No Repository Linked</h2>
              <p>Configure GitHub Token in Settings to manage files.</p>
          </div>
      );
  }

  return (
    <div className="flex h-full bg-[#0d1117] text-slate-300 font-sans">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-800 flex flex-col bg-[#010409]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <GitBranch size={16} className="text-purple-400"/>
                    <span className="truncate w-32">{settings.githubRepo.split('/')[1]}</span>
                </div>
                <button onClick={loadTree} className="text-slate-500 hover:text-white"><RefreshCw size={14} className={isLoading ? 'animate-spin' : ''}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.map((f) => (
                    <div 
                        key={f.path} 
                        onClick={() => handleFileClick(f)}
                        className={`px-3 py-2 rounded flex items-center gap-2 cursor-pointer text-xs ${activeFile === f.path ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-slate-800'}`}
                    >
                        {f.type === 'dir' ? <Folder size={14} className="text-yellow-600"/> : <FileCode size={14} className="text-slate-500"/>}
                        <span className="truncate">{f.path}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col relative">
            {activeFile ? (
                <>
                    <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0d1117]">
                        <span className="text-xs font-mono flex items-center gap-2 text-white">
                             <button onClick={() => setActiveFile(null)} className="md:hidden p-1 hover:bg-white/10 rounded mr-2">
                                 <ArrowLeft size={16} className="text-slate-300"/>
                             </button>
                             <FileCode size={14} className="text-blue-400"/> {activeFile} 
                             {isDirty && <span className="text-yellow-500 text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">MODIFIED</span>}
                        </span>
                        
                        <div className="flex gap-2">
                            {/* SCAN BUTTON */}
                            <button 
                                onClick={handleScan}
                                disabled={isAnalyzing}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all border border-blue-500/30 ${isAnalyzing ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
                            >
                                {isAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14}/>}
                                {isAnalyzing ? 'DIAGNOSING...' : `EMERGENT SCAN`}
                            </button>

                            <button 
                                onClick={handleSave}
                                disabled={!isDirty || isLoading}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${isDirty ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-slate-800 text-slate-500'}`}
                            >
                                <Save size={14}/> COMMIT
                            </button>
                        </div>
                    </div>
                    
                    {/* Fixes Proposal Overlay (The Permission Gate) */}
                    {pendingFixedContent && (
                        <div className="bg-yellow-900/20 border-b border-yellow-500/20 px-4 py-3 text-xs text-yellow-200 animate-fade-in-up">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 font-bold text-yellow-400">
                                    <AlertTriangle size={14}/> 
                                    AI PROPOSED PATCH ({fixes.length} Issues)
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setPendingFixedContent(null)} className="px-3 py-1 hover:bg-white/10 rounded flex items-center gap-1 text-slate-400">
                                        <XCircle size={12}/> REJECT
                                    </button>
                                    <button onClick={confirmFix} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg flex items-center gap-1">
                                        <Check size={12}/> AUTHORIZE EXECUTION
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {fixes.map((fix, i) => (
                                    <span key={i} className="bg-black/30 px-2 py-1 rounded text-yellow-500 font-mono border border-yellow-500/10 text-[10px]">
                                        L{fix.line}: {fix.issue}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Editor 
                        height="100%" 
                        defaultLanguage={activeFile.endsWith('.json') ? 'json' : activeFile.endsWith('.yml') ? 'yaml' : 'python'}
                        value={pendingFixedContent || fileContent} // Show proposed content if available preview
                        theme="vs-dark"
                        options={{ 
                            minimap: { enabled: false }, 
                            fontSize: 13, 
                            backgroundColor: '#0d1117',
                            readOnly: !!pendingFixedContent // Lock editing while reviewing proposal
                        }}
                    />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-600">
                    <UploadCloud size={64} className="opacity-10 animate-pulse"/>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-500">Sovereign Editor Ready</h3>
                        <p className="text-sm">Select a file to begin emergent scanning.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
