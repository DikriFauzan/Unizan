import React, { useState, useEffect } from 'react';
import { GitBranch, Folder, FileCode, Save, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import { AppSettings } from '../types';
import Editor from '@monaco-editor/react';
import { fetchRepoTree, fetchFileContent, commitFileToGithub, GithubFile } from '../services/githubService';

interface Props {
  settings: AppSettings;
}

export const RepoManager: React.FC<Props> = ({ settings }) => {
  const [tree, setTree] = useState<GithubFile[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFile, setActiveFile] = useState<GithubFile | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [commitMsg, setCommitMsg] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  useEffect(() => {
    if (settings.githubRepo) loadTree('');
  }, [settings.githubRepo]);

  const loadTree = async (path: string) => {
    setLoading(true);
    const data = await fetchRepoTree(settings, path);
    setTree(data);
    setCurrentPath(path);
    setLoading(false);
  };

  const handleNavigate = (file: GithubFile) => {
    if (file.type === 'dir') {
      loadTree(file.path);
    } else {
      loadFile(file);
    }
  };

  const loadFile = async (file: GithubFile) => {
    setLoading(true);
    const content = await fetchFileContent(settings, file.path);
    setActiveFile(file);
    setFileContent(content);
    setLoading(false);
  };

  const handleCommit = async () => {
    if (!activeFile || !commitMsg) return;
    setIsCommitting(true);
    try {
      await commitFileToGithub(settings, activeFile.path, fileContent, commitMsg);
      setCommitMsg('');
      alert('Changes committed successfully!');
    } catch (e: any) {
      alert('Commit failed: ' + e.message);
    }
    setIsCommitting(false);
  };

  if (!settings.githubRepo) return <div className="p-10 text-center text-slate-500">Please configure GitHub Repository in Settings.</div>;

  return (
    <div className="p-4 h-full flex flex-col text-white">
      <div className="flex justify-between items-center mb-4 p-2 border-b border-white/10">
        <div className="flex items-center gap-2">
           <GitBranch className="text-purple-400" size={20}/>
           <div>
             <h2 className="font-bold text-sm">{settings.githubRepo}</h2>
             <p className="text-xs text-slate-500 font-mono">{activeFile ? activeFile.path : (currentPath || 'root')}</p>
           </div>
        </div>
        <div className="flex gap-2">
           {(currentPath || activeFile) && <button onClick={() => { setActiveFile(null); loadTree(''); }} className="p-2 hover:bg-white/10 rounded-full text-slate-300"><ArrowLeft size={18} /></button>}
           <button onClick={() => loadTree(currentPath)} className="p-2 hover:bg-white/10 rounded-full text-slate-300"><RefreshCw size={18} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden border border-white/10 rounded-lg bg-[#0d1117]">
         {loading ? (
             <div className="w-full flex items-center justify-center text-slate-500 gap-2"><Loader2 className="animate-spin" /> Fetching...</div>
         ) : activeFile ? (
             <div className="flex-1 flex flex-col">
                 <div className="h-full relative">
                     <Editor
                        height="100%"
                        defaultLanguage="typescript"
                        theme="vs-dark"
                        value={fileContent}
                        onChange={(val) => setFileContent(val || '')}
                     />
                 </div>
                 <div className="p-3 bg-[#161b22] border-t border-white/10 flex gap-2 items-center">
                    <input value={commitMsg} onChange={e => setCommitMsg(e.target.value)} placeholder="Commit message..." className="flex-1 bg-[#0d1117] border border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-purple-500" />
                    <button onClick={handleCommit} disabled={isCommitting || !commitMsg} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2">{isCommitting ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} COMMIT</button>
                 </div>
             </div>
         ) : (
             <div className="flex-1 overflow-y-auto">
                 {tree.map(item => (
                     <div key={item.sha} onClick={() => handleNavigate(item)} className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5">
                        {item.type === 'dir' ? <Folder size={16} className="text-blue-400"/> : <FileCode size={16} className="text-slate-400"/>}
                        <span className="text-sm font-mono">{item.name}</span>
                     </div>
                 ))}
                 {tree.length === 0 && <div className="p-4 text-center text-slate-500 text-xs">Empty directory.</div>}
             </div>
         )}
      </div>
    </div>
  );
};
