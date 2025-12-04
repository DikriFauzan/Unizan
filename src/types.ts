export interface User { id: string; name: string; phoneNumber: string; role: 'admin' | 'viewer'; }
export interface GameEndpoint { id: string; name: string; port: string; type: 'telemetry' | 'control' | 'iap_verification'; status: 'active' | 'inactive'; }
export interface AppSettings { godotWsUrl: string; githubToken: string; githubRepo: string; gameEndpoints: GameEndpoint[]; }
export interface Message { id: string; senderId: string; content: string; timestamp: Date; type: 'text' | 'code' | 'alert' | 'build-log' | 'github-fix' | 'web-preview' | 'image' | 'video' | 'strategy-card' | 'ideation-graph'; meta?: any; attachment?: { name: string; type: string; size: number; base64?: string; textContent?: string; }; }
export interface ChatRoom { id: string; name: string; type: 'system' | 'ai' | 'bridge'; lastMessage?: string; lastTimestamp?: Date; unreadCount: number; status: 'online' | 'offline' | 'busy'; icon: string; }
export interface BuildStatus { step: 'idle' | 'cloning' | 'analysis' | 'patching' | 'building' | 'bundling' | 'signing' | 'uploading' | 'complete' | 'error'; mode: 'private' | 'public'; progress: number; log: string[]; apkUrl?: string; legacyCoreDetected?: boolean; }
export interface BuildDiagnosis { cause: string; confidence: 'high' | 'medium' | 'low'; fixDescription: string; affectedFile: string; patchedContent: string; }
export interface IdeationNode { id: string; title: string; description: string; type: 'concept' | 'tech' | 'step'; children?: IdeationNode[]; }
export interface TermuxNode { id: string; name: string; game: string; status: 'online' | 'offline' | 'warning'; cpu: number; ram: number; uptime: string; logs: string[]; }
export type NeoAgentType = 'AISupervisor' | 'ShellAgent' | 'RepoAgent' | 'CodeAgent' | 'BuildAgent' | 'RenderAgent' | 'SecurityAgent' | 'AssetGeneratorAgent' | 'MapGeneratorAgent';
export interface NeoAgentStatus { id: string; name: string; type: NeoAgentType; status: 'idle' | 'working' | 'error' | 'offline'; lastAction: string; }
export interface PendingFix { id: string; file: string; issue: string; proposedFix: string; severity: 'low' | 'medium' | 'high' | 'critical'; status: 'pending' | 'approved' | 'rejected'; }
export interface RevenueDataPoint { name: string; uv: number; pv: number; amt: number; }
export interface LtvDataPoint { day: string; ltv: number; }
export type GeneratorType = 'ui-layout' | 'shader' | 'apk-signer';
