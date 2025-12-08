import React, { useState, useMemo } from 'react';
import { Bot, Terminal, Code2, Hammer, Palette, Shield, Image, Send, Folder, FileText, Lock, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { NeoAgentStatus, NeoAgentType } from '../types';

interface Props {
  agents: NeoAgentStatus[];
  onSendCommand: (agentName: string, command: string) => void;
  onSaveFile: (filename: string, content: string) => void;
  onAddAgent: (agent: NeoAgentStatus) => void;
}

const MOCK_VAULT_FILES = [
  { path: 'project.godot', type: 'file', content: 'config_version=5\n\n[application]\nconfig/name="NeoRPG"\nrun/main_scene="res://scenes/main.tscn"\n\n[display]\nwindow/size/viewport_width=1280\nwindow/size/viewport_height=720' },
  { path: 'README.md', type: 'file', content: '# NeoRPG - FEAC Managed\n\nAutomated via NeoEngine Bridge.\n\n## Structure\n- /src: Source code\n- /assets: Game assets' },
  { path: 'scripts/player.gd', type: 'file', content: 'extends CharacterBody3D\n\nconst SPEED = 5.0\nconst JUMP_VELOCITY = 4.5\n\nfunc _physics_process(delta):\n\tif not is_on_floor():\n\t\tvelocity.y -= gravity * delta\n\tmove_and_slide()' },
  { path: 'scenes/main.tscn', type: 'file', content: '[gd_scene load_steps=3 format=3 uid="uid://c8..."]\n\n[node name="Main" type="Node3D"]\n' },
];

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: TreeNode[];
  content?: string;
}

export const NeoEngineControl: React.FC<Props> = ({ agents, onSendCommand, onSaveFile, onAddAgent }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [viewMode, setViewMode] = useState<'console' | 'files'>('console');
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<string[]>([
    '> NeoEngine Control Grid Initialized...',
    `> Mounting Isolated Vault: .../FEAC_VAULT`,
    '> Access Granted. Agents Detected.'
  ]);

  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentType, setNewAgentType] = useState<NeoAgentType>('CodeAgent');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['scripts', 'scenes']));
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleCreateAgent = () => {
      if(!newAgentName) return;
      const newAgent: NeoAgentStatus = {
          id: `agent-${Date.now()}`,
          name: newAgentName,
          type: newAgentType,
          status: 'idle',
          lastAction: 'Initialized'
      };
      onAddAgent(newAgent);
      setShowAddAgentModal(false);
      setNewAgentName('');
  };

  const fileTree = useMemo(() => {
    const root: TreeNode[] = [];
    MOCK_VAULT_FILES.forEach(file => {
      const parts = file.path.split('/');
      let currentLevel = root;
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const existingNode = currentLevel.find(n => n.name === part);
        if (existingNode) {
          currentLevel = existingNode.children;
        } else {
          const newNode: TreeNode = {
            name: part,
            path: parts.slice(0, index + 1).join('/'),
            type: isFile ? 'file' : 'folder',
            children: [],
            content: isFile ? file.content : undefined
          };
          currentLevel.push(newNode);
          currentLevel = newNode.children;
        }
      });
    });
    return root;
  }, []);

  const handleSend = () => {
    if(!command.trim() || !selectedAgent) return;
    onSendCommand(selectedAgent.name, command);
    setLogs(prev => [...prev, `[${selectedAgent.name}] > ${command}`, `[${selectedAgent.name}] < Executing...`]);
    setCommand('');
  };

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders);
    if (next.has(path)) next.delete(path); else next.add(path);
    setExpandedFolders(next);
  };

  const handleOpenFile = (node: TreeNode) => {
    if (node.type === 'file') {
      setActiveFile(node.path);
      setFileContent(node.content || '');
    }
  };

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.path}>
        <div 
          className={`flex items-center gap-2 py-1.5 px-3 cursor-pointer transition-colors border-l-2 ${activeFile === node.path ? 'bg-blue-500/10 text-blue-300 border-blue-500' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => node.type === 'folder' ? toggleFolder(node.path) : handleOpenFile(node)}
        >
          {node.type === 'folder' ? (
            <span className="text-slate-500">
              {expandedFolders.has(node.path) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
            </span>
          ) : <span className="w-3.5"></span>}
          
          {node.type === 'folder' ? (
            <Folder size={14} className={expandedFolders.has(node.path) ? 'text-yellow-400' : 'text-yellow-600'} />
          ) : (
            <FileText size={14} className={activeFile === node.path ? "text-blue-400" : "text-slate-500"} />
          )}
          
          <span className="text-xs font-mono truncate tracking-tight">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.path) && (
          <div>{renderTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const getIcon = (type: NeoAgentType) => {
      switch(type) {
          case 'AISupervisor': return <Bot size={20}/>;
          case 'CodeAgent': return <Code2 size={20}/>;
          case 'BuildAgent': return <Hammer size={20}/>;
          case 'RenderAgent': return <Palette size={20}/>;
          case 'SecurityAgent': return <Shield size={20}/>;
          case 'AssetGeneratorAgent': return <Image size={20}/>;
          default: return <Terminal size={20}/>;
      }
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scroll flex flex-col relative font-sans text-white">
       <div className="flex justify-between items-center mb-8">
           <div>
               <h1 className="text-2xl md:text-3xl font-light text-white flex items-center gap-3">
                   <Bot className="text-blue-400" size={28}/> 
                   <span className="font-bold">NEO</span><span className="text-slate-500">GRID</span>
               </h1>
               <div className="flex items-center gap-2 mt-2">
                   <p className="text-[10px] text-green-400 flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded border border-green-500/30 tracking-wider">
                       <Lock size={10} /> ISOLATED VAULT
                   </p>
               </div>
           </div>
           <div className="flex gap-3">
               <button onClick={() => setShowAddAgentModal(true)} className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/40 hover:text-white flex items-center gap-2 transition-all"><Plus size={14}/> AGENT</button>
               <div className="bg-[#171717] rounded-lg p-1 border border-white/10 flex">
                   <button onClick={() => setViewMode('console')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'console' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>CONSOLE</button>
                   <button onClick={() => setViewMode('files')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'files' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>EXPLORER</button>
               </div>
           </div>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {agents.map((agent) => (
              <div 
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAgentId === agent.id ? 'bg-[#171717] ring-1 ring-blue-500/50' : 'bg-[#0d1117]/60 border-white/5'}`}
              >
                  <div className={`mb-3 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedAgentId === agent.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'}`}>
                      {getIcon(agent.type)}
                  </div>
                  <div className="font-bold text-sm text-white mb-1 truncate">{agent.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{agent.type}</div>
              </div>
          ))}
       </div>

       <div className="flex-1 bg-[#0d1117]/80 backdrop-blur-md rounded-xl border border-white/10 flex flex-col overflow-hidden h-[500px] shadow-2xl">
           {viewMode === 'console' ? (
               <>
                   <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scroll text-slate-300 space-y-1.5 bg-black/20">
                       {logs.map((l, i) => <div key={i} className="flex gap-2 text-green-400"><span>{l}</span></div>)}
                   </div>
                   <div className="p-3 bg-[#171717] border-t border-white/5 flex gap-2">
                       <input 
                          value={command}
                          onChange={e => setCommand(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSend()}
                          className="flex-1 bg-transparent text-white outline-none font-mono text-xs py-2 placeholder:text-slate-600"
                          placeholder={selectedAgent ? `Execute on ${selectedAgent.name}...` : 'Select an agent...'}
                       />
                       <button onClick={handleSend} className="bg-blue-600 px-4 rounded-lg text-white"><Send size={16}/></button>
                   </div>
               </>
           ) : (
               <div className="flex-1 flex overflow-hidden">
                   <div className="w-full md:w-64 bg-[#111b21]/50 border-r border-white/5 overflow-y-auto custom-scroll flex-shrink-0">
                       <div className="py-2">{renderTree(fileTree)}</div>
                   </div>
                   <div className="flex-1 flex-col bg-[#1e1e1e] flex">
                       {activeFile ? (
                           <Editor 
                               height="100%" 
                               defaultLanguage="python"
                               theme="vs-dark"
                               value={fileContent}
                               onChange={(val) => setFileContent(val || '')}
                               options={{ minimap: { enabled: false }, fontSize: 13, automaticLayout: true }}
                           />
                       ) : (
                           <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
                               <Code2 size={32} className="opacity-50"/>
                               <p className="text-xs font-mono">SELECT FILE</p>
                           </div>
                       )}
                   </div>
               </div>
           )}
       </div>

       {showAddAgentModal && (
           <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
               <div className="bg-[#171717] p-6 rounded-2xl w-full max-w-sm border border-white/10">
                   <h3 className="text-lg font-bold text-white mb-4">DEPLOY NEW NODE</h3>
                   <input value={newAgentName} onChange={e => setNewAgentName(e.target.value)} className="w-full bg-black/50 p-3 rounded-lg text-white border border-white/10 mb-4" placeholder="Agent Name"/>
                   <button onClick={handleCreateAgent} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">INITIALIZE</button>
                   <button onClick={() => setShowAddAgentModal(false)} className="w-full mt-2 text-slate-500 text-xs">CANCEL</button>
               </div>
           </div>
       )}
    </div>
  );
};
