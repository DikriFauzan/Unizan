import React, { useState, useEffect } from 'react';
import { GitBranch, Folder, FileCode, Save, RefreshCw, UploadCloud, Github, AlertTriangle, Wand2, Loader2, Check, ArrowLeft } from 'lucide-react';
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
          setIsLoading(false);
      } else {
          // Expand folder (simple impl)
          const subTree = await fetchRepoTree(settings, file.path);
          setFiles(prev => [...prev.filter(p => !p.path.startsWith(file.path + '/')), ...subTree]);
      }
  };

  const handleSave = async () => {
      if (!activeFile) return;
      setIsLoading(true);
      try {
          await commitFileToGithub(settings, activeFile, fileContent, `FEAC Auto-Fix: ${activeFile}`);
          setIsDirty(false);
          alert("✅ Committed to GitHub successfully.");
      } catch (e) {
          alert("❌ Commit Failed. Check Token.");
      }
      setIsLoading(false);
  };

  const handleScanAndFix = async () => {
      if (!activeFile) return;
      setIsAnalyzing(true);
      
      // 1. Analyze
      const detectedFixes = await analyzeCode(fileContent, activeFile);
      setFixes(detectedFixes);
      
      // 2. Auto Apply
      if (detectedFixes.length > 0) {
          const fixedCode = await applyAutoFix(fileContent, detectedFixes);
          setFileContent(fixedCode);
          setIsDirty(true);
      }
      
      setIsAnalyzing(false);
  };

  if (!settings.githubRepo || !settings.githubToken) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-[#0d1117]">
              <Github size={48} className="mb-4 opacity-50"/>
              <h2 className="text-xl font-bold text-white">No Repository Linked</h2>
              <p>Go to Settings and configure GitHub Token to enable Sovereign Code Management.</p>
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
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scroll">
                {files.map((f) => (
                    <div 
                        key={f.path} 
                        onClick={() => handleFileClick(f)}
                        className={`px-3 py-2 rounded flex items-center gap-2 cursor-pointer text-xs transition-colors ${activeFile === f.path ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-slate-800'}`}
                    >
                        {f.type === 'dir' ? <Folder size={14} className="text-yellow-600"/> : <FileCode size={14} className="text-slate-500"/>}
                        <span className="truncate">{f.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col relative bg-[#0d1117]">
            {activeFile ? (
                <>
                    <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-[#0d1117]">
                        <span className="text-xs font-mono flex items-center gap-2 text-white">
                             <FileCode size={14} className="text-blue-400"/> {activeFile} 
                             {isDirty && <span className="text-yellow-500 text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">MODIFIED</span>}
                        </span>
                        
                        <div className="flex gap-2">
                            {/* AUTO FIX BUTTON */}
                            <button 
                                onClick={handleScanAndFix}
                                disabled={isAnalyzing}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all border border-blue-500/30 ${isAnalyzing ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
                            >
                                {isAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14}/>}
                                {isAnalyzing ? 'AI SCANNING...' : `AUTO-FIX & HEAL`}
                            </button>

                            <button 
                                onClick={handleSave}
                                disabled={!isDirty || isLoading}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all ${isDirty ? 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                                {isLoading ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} COMMIT
                            </button>
                        </div>
                    </div>
                    
                    {/* Fixes Overlay */}
                    {fixes.length > 0 && (
                        <div className="bg-yellow-900/20 border-b border-yellow-500/20 px-4 py-2 text-[10px] text-yellow-200 flex items-center gap-4 animate-fade-in-up">
                            <AlertTriangle size={12} className="text-yellow-500"/>
                            <span>FEAC applied {fixes.length} fixes automatically. Review before committing.</span>
                            <div className="flex gap-2 flex-wrap">
                                {fixes.slice(0, 3).map((fix, i) => (
                                    <span key={i} className="bg-black/30 px-2 py-0.5 rounded text-yellow-500 font-mono border border-yellow-500/10">L{fix.line}: {fix.issue}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Editor 
                        height="100%" 
                        defaultLanguage={activeFile.endsWith('.json') ? 'json' : activeFile.endsWith('.ts') ? 'typescript' : 'python'}
                        value={fileContent}
                        theme="vs-dark"
                        onChange={(val) => { setFileContent(val || ''); setIsDirty(true); }}
                        options={{ 
                            minimap: { enabled: false }, 
                            fontSize: 13, 
                            fontFamily: "'JetBrains Mono', monospace",
                            backgroundColor: '#0d1117'
                        }}
                    />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-600">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center animate-pulse">
                        <UploadCloud size={40} className="opacity-50"/>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-500">Sovereign Editor Ready</h3>
                        <p className="text-sm">Select a file from the repository to edit or scan.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
