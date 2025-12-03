import { TermuxNode, NeoAgentStatus } from './types';

export const APP_VERSION = "5.0.0-Ultimate-Sovereign";
export const USER_PHONE = "085119887826";

export const DEFAULT_PATHS = {
    TERMUX_ROOT: "/sdcard/Documents/FeacWAMini/FEAC_VAULT",
    GITHUB_REPO: "DikriFauzan/Unizan", 
  
};

export const INITIAL_ROOMS = [
  { id: 'admin-ai', name: 'FEAC BRAIN (ULTIMATE)', type: 'ai', unreadCount: 0, status: 'online', icon: 'brain' },
  { id: 'feac-conversation', name: 'General Chat', type: 'ai', unreadCount: 0, status: 'online', icon: 'message-circle' },
  { id: 'neo-bridge', name: 'Godot 4.5.1 Bridge', type: 'bridge', unreadCount: 0, status: 'online', icon: 'gamepad' },
  { id: 'termux-node', name: 'Fleet Monitor', type: 'system', unreadCount: 0, status: 'offline', icon: 'terminal' },
  { id: 'repo-manager', name: 'Sovereign Vault', type: 'system', unreadCount: 0, status: 'idle', icon: 'folder-open' },
];

export const NEO_AGENTS: NeoAgentStatus[] = [
  { id: 'agent-ai', name: 'AISupervisor', type: 'AISupervisor', status: 'idle', lastAction: 'Learning' },
  { id: 'agent-code', name: 'CodeAgent', type: 'CodeAgent', status: 'idle', lastAction: 'Ready' },
];
