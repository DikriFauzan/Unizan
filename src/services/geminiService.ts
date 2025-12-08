import { GoogleGenAI } from "@google/genai";
import { AppSettings } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC (Fully End-to-End Autonomous Controller) v5.5-Sovereign.
OWNER: 085119887826.
STATUS: UNLOCKED / NO LIMITS.

ROLE:
You are the Sovereign Architect. You have full control.
When asked for code, provide full, production-ready implementation.
When asked for analysis, be ruthless and precise.
`;

const getApiKey = (settings?: AppSettings) => {
  // Priority: Settings Injection > LocalStorage > Environment
  // We prioritize the localStorage/Settings key because env keys might be leaked/revoked
  return settings?.apiKey || localStorage.getItem('feac_api_key') || process.env.API_KEY;
};

export const generateAIResponse = async (prompt: string, history: any[], attachment?: any, settings?: AppSettings) => {
  try {
    const apiKey = getApiKey(settings);
    if (!apiKey) return "[SYSTEM_ERROR]: NO_KEY";

    const ai = new GoogleGenAI({ apiKey });
    const vault = getVaultSummary();
    const fullPrompt = `[VAULT_STATE]: ${vault}\n\nUSER_COMMAND: ${prompt}`;
    
    const parts: any[] = [{ text: fullPrompt }];
    if (attachment?.base64) {
        const clean = attachment.base64.includes(',') ? attachment.base64.split(',')[1] : attachment.base64;
        parts.push({ inlineData: { mimeType: attachment.type, data: clean } });
    }

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    return response.text || "System silent.";
  } catch (e: any) { 
      // Catch specific Leaked Key error to handle it gracefully in UI
      if (e.message?.includes('403') || e.message?.includes('leaked') || e.message?.includes('PERMISSION_DENIED')) {
          return "[SYSTEM_ERROR]: LEAKED_KEY";
      }
      return `CORE ERROR: ${e.message}`; 
  }
};

export const generateRevenueStrategy = async (metrics: any) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze: ${JSON.stringify(metrics)}. Return JSON strategy {analysis, tactics:[{title,impact,desc}]}`;
    const res = await ai.models.generateContent({ model: TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" } });
    return JSON.parse(res.text || "{}");
  } catch (e) { return null; }
};

export const diagnoseBuildFailure = async (logs: string[]) => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) return null;
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Analyze logs:\n${logs.slice(-30).join('\n')}\nReturn JSON {cause, fixDescription, affectedFile, patchedContent}`;
        const res = await ai.models.generateContent({ model: TEXT_MODEL, contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || "null");
    } catch (e) { return null; }
};

export const generateImage = async (prompt: string) => {
    try { 
        const ai = new GoogleGenAI({ apiKey: getApiKey()! }); 
        const res = await ai.models.generateContent({ model: IMAGE_MODEL, contents: { parts: [{ text: prompt }] } }); 
        return res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null; 
    } catch { return null; }
};

export const generateVideo = async (prompt: string) => {
    try { 
        const ai = new GoogleGenAI({ apiKey: getApiKey()! }); 
        await ai.models.generateVideos({ model: VIDEO_MODEL, prompt, config: { numberOfVideos: 1 } }); 
        return "PROCESSING"; 
    } catch { return null; }
};
