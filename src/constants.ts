import { TermuxNode, NeoAgentStatus, GameEndpoint } from './types';

// INI VERSI BARU YANG AKAN MUNCUL
export const APP_VERSION = "6.0.0-Genesis-Overlord"; 
export const USER_PHONE = "085119887826";

export const DEFAULT_PATHS = {
    TERMUX_ROOT: "/sdcard/Documents/FeacWAMini/FEAC_VAULT",
    GITHUB_REPO: "DikriFauzan/Unizan", 
    NEO_PORT: "8090"
};

export const DEFAULT_GAME_PORTS: GameEndpoint[] = [
    { id: 'p1', name: 'NeoEngine Control', port: '8090', type: 'control', status: 'active' },
    { id: 'p2', name: 'Game Telemetry (Live)', port: '8091', type: 'telemetry', status: 'active' },
    { id: 'p3', name: 'IAP Verification', port: '8092', type: 'iap_verification', status: 'active' }
];

export const INITIAL_ROOMS = [
  { id: 'admin-ai', name: 'FEAC BRAIN (v6.0)', type: 'ai', unreadCount: 0, status: 'online', icon: 'brain' },
  { id: 'feac-conversation', name: 'General Chat', type: 'ai', unreadCount: 0, status: 'online', icon: 'message-circle' },
  { id: 'neo-bridge', name: 'Godot 4.5.1 Bridge', type: 'bridge', unreadCount: 0, status: 'online', icon: 'gamepad' },
  { id: 'termux-node', name: 'Fleet Monitor', type: 'system', unreadCount: 0, status: 'offline', icon: 'terminal' },
  { id: 'repo-manager', name: 'Sovereign Vault', type: 'system', unreadCount: 0, status: 'idle', icon: 'folder-open' },
];

export const NEO_AGENTS: NeoAgentStatus[] = [
  { id: 'agent-ai', name: 'AISupervisor', type: 'AISupervisor', status: 'idle', lastAction: 'Learning' },
  { id: 'agent-code', name: 'CodeAgent', type: 'CodeAgent', status: 'idle', lastAction: 'Ready' },
];

export const MOCK_REVENUE_DATA = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

export const MOCK_LTV_DATA = [
    { day: 'D1', ltv: 0.5 }, { day: 'D7', ltv: 1.2 }, { day: 'D30', ltv: 4.8 }
];

export const MOCK_TERMUX_NODES: TermuxNode[] = [
  { id: 'node-01', name: 'Pixel 7 Pro (Termux)', game: 'NeoRPG v1.2', status: 'online', cpu: 12, ram: 34, uptime: '4d 2h', logs: ['[NET] Player connected: ID 4402', '[GAME] Level 4 loaded'] },
  { id: 'node-02', name: 'AWS t3.micro', game: 'CyberRacer Server', status: 'warning', cpu: 85, ram: 72, uptime: '12d 5h', logs: ['[WARN] High latency detected', '[NET] Sync drift > 50ms'] },
];
