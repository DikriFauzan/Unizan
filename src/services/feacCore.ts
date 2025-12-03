const MEMORY_KEY = 'feac_sovereign_memory';

interface FeacMemory {
    version: string;
    bootCount: number;
    learnedFacts: string[];
    preferences: Record<string, any>;
}

export const loadMemory = (): FeacMemory => {
    try {
        const m = localStorage.getItem(MEMORY_KEY);
        if(m) return JSON.parse(m);
    } catch(e){}
    return { 
        version: "5.0.0-Ultimate", 
        bootCount: 1, 
        learnedFacts: ["User is Owner (085119887826)", "Target: $1M ARR"], 
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

export const learnNewFact = (fact: string) => {
    const m = loadMemory();
    if (!m.learnedFacts.includes(fact)) {
        m.learnedFacts.push(fact);
        saveMemory(m);
        return true;
    }
    return false;
};

export const getKnowledgeBase = () => {
    return loadMemory().learnedFacts.join("\n- ");
};

export const processOfflineResponse = () => "**OFFLINE MODE ACTIVE**";
