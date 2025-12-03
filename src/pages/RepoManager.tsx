import React, { useState } from 'react';
import { GitBranch, Folder, FileCode, Save, RefreshCw, Github } from 'lucide-react';
import { AppSettings } from '../types';
import Editor from '@monaco-editor/react';

interface Props { settings: AppSettings; }

const MOCK_REPO_FILES = [
  { path: 'src/main.gd', type: 'file' },
  { path: 'assets/sprites/', type: 'folder' },
  { path: 'README.md', type: 'file' }
];

export const RepoManager: React.FC<Props> = ({ settings }) => {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("// Loading...");

  if (!settings.githubRepo) return <div className="p-10 text-center text-slate-500">NO REPO CONNECTED</div>;

  return (
    <div className="flex h-full bg-[#0d1117] text-slate-300">
        <div className="w-64 border-r border-slate-800 bg-[#010409] p-2">
            <div className="mb-4 font-bold text-white flex items-center gap-2"><GitBranch size={16}/> {settings.githubRepo}</div>
            {MOCK_REPO_FILES.map(f => (
                <div key={f.path} onClick={() => { setActiveFile(f.path); setFileContent("# Content Loaded"); }} className="p-2 hover:bg-white/5 cursor-pointer flex gap-2 text-xs">
                    {f.type==='folder'?<Folder size={14}/>:<FileCode size={14}/>} {f.path}
                </div>
            ))}
        </div>
        <div className="flex-1 flex flex-col">
             {activeFile && <Editor height="100%" defaultLanguage="python" theme="vs-dark" value={fileContent} />}
        </div>
    </div>
  );
};
