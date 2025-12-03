const MEMORY_KEY = 'feac_sovereign_memory';
const VAULT_KEY = 'feac_encrypted_vault_v1';

// --- NEURAL LOCK ENCRYPTION (SIMULATED) ---
// Makes data unreadable to humans, accessible only to FEAC logic.
const neuralEncrypt = (text: string): string => {
    try {
        // Simple XOR + Base64 obfuscation to simulate "FEAC Only" access
        const key = "FEAC_SOVEREIGN_KEY_085119887826";
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result); // Encode to Base64
    } catch (e) { return text; }
};

const neuralDecrypt = (cipher: string): string => {
    try {
        const text = atob(cipher);
        const key = "FEAC_SOVEREIGN_KEY_085119887826";
        let result = "";
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    } catch (e) { return "{}"; }
};

interface FeacMemory {
    version: string;
    bootCount: number;
    preferences: Record<string, any>;
}

interface VaultData {
    facts: string[];
    strategies: string[];
    conversation_summary: string[];
    last_updated: string;
}

// --- SHORT TERM MEMORY (System Config) ---
export const loadMemory = (): FeacMemory => {
    try {
        const m = localStorage.getItem(MEMORY_KEY);
        if(m) return JSON.parse(m);
    } catch(e){}
    return { 
        version: "5.5.0-Vault-Enabled", 
        bootCount: 1, 
        preferences: { theme: 'high-contrast' } 
    };
};

export const saveMemory = (s: FeacMemory) => localStorage.setItem(MEMORY_KEY, JSON.stringify(s));

export const upgradeSystemVersion = (v: string) => {
    const parts = v.split('.');
    const newVer = `${parts[0]}.${parts[1]}.${parseInt(parts[2])+1}-Sovereign`;
    const m = loadMemory(); 
    m.version = newVer; 
    saveMemory(m);
    return newVer;
};

// --- LONG TERM MEMORY (THE VAULT) ---

export const loadVault = (): VaultData => {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return { facts: [], strategies: [], conversation_summary: [], last_updated: new Date().toISOString() };
    try {
        return JSON.parse(neuralDecrypt(raw));
    } catch(e) {
        console.error("Vault Corruption Detected");
        return { facts: [], strategies: [], conversation_summary: [], last_updated: new Date().toISOString() };
    }
};

export const saveToVault = (data: VaultData) => {
    const encrypted = neuralEncrypt(JSON.stringify(data));
    localStorage.setItem(VAULT_KEY, encrypted);
};

export const learnNewFact = (fact: string) => {
    const vault = loadVault();
    if (!vault.facts.includes(fact)) {
        vault.facts.push(fact);
        vault.last_updated = new Date().toISOString();
        saveToVault(vault);
        return true;
    }
    return false;
};

export const archiveStrategy = (strategy: string) => {
    const vault = loadVault();
    vault.strategies.push(strategy);
    saveToVault(vault);
};

export const getVaultSummary = () => {
    const vault = loadVault();
    return `
    [VAULT ACCESS GRANTED]
    > Learned Facts: ${vault.facts.length}
    > Stored Strategies: ${vault.strategies.length}
    > Key Data:
    ${vault.facts.slice(-10).map(f => `- ${f}`).join('\n')}
    ${vault.strategies.slice(-5).map(s => `- STRAT: ${s}`).join('\n')}
    `;
};

export const processOfflineResponse = () => "**OFFLINE MODE ACTIVE**";
