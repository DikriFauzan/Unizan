export interface User { id: string; name: string; role: 'admin'; }
export interface GameEndpoint { id: string; name: string; port: string; type: 'telemetry' | 'control'; status: 'active'; }
export interface AppSettings { godotWsUrl: string; githubToken: string; githubRepo: string; gameEndpoints: GameEndpoint[]; }
export interface Message { id: string; senderId: string; content: string; timestamp: Date; type: 'text' | 'code' | 'alert'; }
