const MEMORY_KEY = 'feac_sovereign_memory';
const VAULT_KEY = 'feac_encrypted_vault_v1';

const neuralEncrypt = (text: string) => {
    try {
        const key = "FEAC_SOVEREIGN_KEY_085119887826";
        let result = "";
        for (let i = 0; i < text.length; i++) result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        return btoa(result);
    } catch (e) { return text; }
};

const neuralDecrypt = (cipher: string) => {
    try {
        const text = atob(cipher);
        const key = "FEAC_SOVEREIGN_KEY_085119887826";
        let result = "";
        for (let i = 0; i < text.length; i++) result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        return result;
    } catch (e) { return "{}"; }
};

export const loadMemory = () => {
    try {
        const m = localStorage.getItem(MEMORY_KEY);
        if(m) return JSON.parse(m);
    } catch(e){}
    return { version: "4.1.0-Ultimate-Architect", bootCount: 1, preferences: { theme: 'high-contrast' } };
};

export const saveMemory = (s: any) => localStorage.setItem(MEMORY_KEY, JSON.stringify(s));

export const upgradeSystemVersion = (v: string) => {
    const parts = v.split('.');
    const newVer = `${parts[0]}.${parts[1]}.${parseInt(parts[2])+1}-Sovereign`;
    const m = loadMemory(); m.version = newVer; saveMemory(m);
    return newVer;
};

export const loadVault = () => {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return { facts: [], strategies: [] };
    try { return JSON.parse(neuralDecrypt(raw)); } catch(e) { return { facts: [], strategies: [] }; }
};

export const saveToVault = (data: any) => {
    localStorage.setItem(VAULT_KEY, neuralEncrypt(JSON.stringify(data)));
};

export const learnNewFact = (fact: string) => {
    const vault = loadVault();
    if (!vault.facts.includes(fact)) { vault.facts.push(fact); saveToVault(vault); return true; }
    return false;
};

export const getVaultSummary = () => {
    const v = loadVault();
    return `[VAULT MEMORY]\nFacts: ${v.facts.length}\nStrategies: ${v.strategies.length}`;
};

export const processOfflineResponse = () => "**OFFLINE MODE**";
