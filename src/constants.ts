export const APP_VERSION = '5.0.0-Final-Genesis';
import { TermuxNode, NeoAgentStatus, GameEndpoint } from './types';

export const APP_VERSION = "6.0.0-FINAL-OVERRIDE";
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
  { id: 'admin-ai', name: 'FEAC BRAIN (v5.0)', type: 'ai', unreadCount: 0, status: 'online', icon: 'brain' },
  { id: 'feac-conversation', name: 'General Chat', type: 'ai', unreadCount: 0, status: 'online', icon: 'message-circle' },
  { id: 'neo-bridge', name: 'Godot 4.5.1 Bridge', type: 'bridge', unreadCount: 0, status: 'online', icon: 'gamepad' },
  { id: 'termux-node', name: 'Fleet Monitor', type: 'system', unreadCount: 0, status: 'offline', icon: 'terminal' },
  { id: 'repo-manager', name: 'Sovereign Vault', type: 'system', unreadCount: 0, status: 'idle', icon: 'folder-open' },
];

export const NEO_AGENTS: NeoAgentStatus[] = [
  { id: 'agent-ai', name: 'AISupervisor', type: 'AISupervisor', status: 'idle', lastAction: 'Learning' },
  { id: 'agent-code', name: 'CodeAgent', type: 'CodeAgent', status: 'idle', lastAction: 'Ready' },
];

export const MOCK_REVENUE_DATA = [{ name: 'Jan', uv: 4000, pv: 2400, amt: 2400 }];
export const MOCK_LTV_DATA = [{ day: 'D1', ltv: 0.5 }];
export const MOCK_TERMUX_NODES = [];
