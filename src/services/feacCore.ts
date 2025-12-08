const MEMORY_KEY = 'feac_sovereign_memory';

export const loadMemory = () => {
    try {
        const m = localStorage.getItem(MEMORY_KEY);
        if(m) return JSON.parse(m);
    } catch(e){}
    return { version: "5.3.0-Native", bootCount: 1, notes: [] };
};

export const saveMemory = (s: any) => localStorage.setItem(MEMORY_KEY, JSON.stringify(s));

export const getVaultSummary = () => {
    const mem = loadMemory();
    return `System Version: ${mem.version}. Boot Count: ${mem.bootCount}. Active Notes: ${mem.notes.length}`;
};
