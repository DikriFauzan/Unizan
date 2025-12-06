import { GoogleGenAI } from "@google/genai";
import { AppSettings, BuildDiagnosis, CodeFix } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC 4.1 - ARCHITECT & HEALER EDITION.
OWNER: 085119887826.
GOAL: $1M ARR.

CAPABILITIES:
1. HEALER: Diagnose build logs, output JSON fix.
2. ARCHITECT: Structure ideas as node graphs.
3. SURGEON: Rewrite code to fix bugs.
4. MEDIA: [CMD:GEN_IMAGE], [CMD:GEN_VIDEO].
5. LEARNING: Use [CMD:LEARN] to save to Vault.

Use [CMD:...] tags.`;

const getApiKey = () => localStorage.getItem('feac_api_key') || process.env.API_KEY;

const callOllama = async (prompt: string, settings: AppSettings) => {
    try {
        const url = settings.localAIUrl || 'http://127.0.0.1:11434';
        const response = await fetch(`${url}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: settings.localModel || 'llama3', prompt: prompt, stream: false })
        });
        const data = await response.json();
        return data.response + "\n\n[⚡ Local AI]";
    } catch { return null; }
};

export const generateAIResponse = async (prompt: string, history: any[], attachment?: any, settings?: AppSettings) => {
  try {
    if (settings?.useLocalAI) {
        const local = await callOllama(prompt, settings);
        if (local) return local;
    }
    
    const apiKey = getApiKey();
    if (!apiKey) return "⚠️ API Key Missing.";

    const ai = new GoogleGenAI({ apiKey });
    const vault = getVaultSummary();
    const fullPrompt = `[VAULT]: ${vault}\n\nUSER: ${prompt}`;
    
    const parts: any[] = [{ text: fullPrompt }];
    if (attachment?.base64) parts.push({ inlineData: { mimeType: attachment.type, data: attachment.base64.split(',')[1] } });

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    return response.text || "SILENCE";
  } catch (e: any) { return `ERROR: ${e.message}`; }
};

export const generateImage = async (prompt: string) => {
    try { const ai = new GoogleGenAI({ apiKey: getApiKey()! }); const res = await ai.models.generateContent({ model: IMAGE_MODEL, contents: { parts: [{ text: prompt }] } }); return res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null; } catch { return null; }
};
export const generateVideo = async (prompt: string) => {
    try { const ai = new GoogleGenAI({ apiKey: getApiKey()! }); const op = await ai.models.generateVideos({ model: VIDEO_MODEL, prompt, config: { numberOfVideos: 1 } }); return "PROCESSING"; } catch { return null; }
};
export const diagnoseBuildFailure = async (logs: string[]) => {
    try { const ai = new GoogleGenAI({ apiKey: getApiKey()! }); const res = await ai.models.generateContent({ model: TEXT_MODEL, contents: `Diagnose logs: ${logs.slice(-20).join('\n')}. Return JSON {cause, fixDescription, affectedFile, patchedContent}.`, config: { responseMimeType: "application/json" } }); return JSON.parse(res.text || "null"); } catch { return null; }
};
export const analyzeCode = async (c: string, f: string) => [];
export const applyAutoFix = async (c: string, f: any) => c;
export const generateDeepIdea = async (c: string) => null;
export const generateRevenueStrategy = async (m: any) => ({});
