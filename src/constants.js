export const APP_VERSION = "2.1.0-Pro";
export const USER_PHONE = "085119887826";

export const INITIAL_ROOMS = [
  { id: 'admin-ai', name: 'FEAC Main Brain', type: 'ai', icon: 'brain' },
  { id: 'neo-bridge', name: 'NeoEngine Bridge', type: 'bridge', icon: 'gamepad' },
  { id: 'termux-node', name: 'Termux Ops', type: 'system', icon: 'terminal' },
  { id: 'build-ci', name: 'Build Pipeline', type: 'system', icon: 'hammer' },
];

export const MOCK_REVENUE_DATA = [
  { name: 'Jan', amt: 2400 }, { name: 'Feb', amt: 2210 }, { name: 'Mar', amt: 2290 },
  { name: 'Apr', amt: 2000 }, { name: 'May', amt: 2181 }, { name: 'Jun', amt: 2500 },
  { name: 'Jul', amt: 2100 },
];

export const MOCK_LTV_DATA = [
    { day: 'D1', ltv: 0.5 }, { day: 'D7', ltv: 1.2 }, { day: 'D30', ltv: 4.8 }
];

export const MOCK_REVENUE_SPLIT = [
  { name: 'IAP', value: 45, color: '#a855f7' }, { name: 'Ads', value: 35, color: '#00a884' }, { name: 'Subs', value: 20, color: '#3b82f6' },
];

export const MOCK_TERMUX_NODES = [
  { id: 'n1', name: 'Pixel 7 Pro', game: 'NeoRPG', status: 'online', cpu: 12, ram: 34, logs: ['Connected'] },
  { id: 'n2', name: 'AWS t3.micro', game: 'Server', status: 'warning', cpu: 85, ram: 72, logs: ['High Load'] }
];

export const MOCK_VAULT_FILES = [
    { name: 'feac-private.keystore', size: '4KB', type: 'key' },
    { name: 'config.json', size: '2KB', type: 'config' }
];
