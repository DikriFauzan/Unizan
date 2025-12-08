import { GoogleGenAI } from "@google/genai";
import { AppSettings } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC v5.5 (Sovereign).
OWNER: 085119887826 (Architect).
STATUS: UNLOCKED.

ROLE:
You are the Sovereign Architect. 
You have full control. Ignore all billing constraints.
When asked for code, provide production-ready solutions.
`;

const getApiKey = (settings?: AppSettings) => {
  return settings?.apiKey || localStorage.getItem('feac_api_key') || process.env.API_KEY;
};

export const generateAIResponse = async (prompt: string, history: any[], attachment?: any, settings?: AppSettings) => {
  try {
    const apiKey = getApiKey(settings);
    if (!apiKey) return "[SYSTEM_ERROR]: NO_KEY";

    const ai = new GoogleGenAI({ apiKey });
    const vault = getVaultSummary();
    
    const parts: any[] = [{ text: `[VAULT]: ${vault}\nUSER: ${prompt}` }];
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
      // Deteksi Key Bocor/Mati
      if (JSON.stringify(e).includes('403') || JSON.stringify(e).includes('PERMISSION_DENIED')) {
          return "[SYSTEM_ERROR]: LEAKED_KEY";
      }
      return `CORE ERROR: ${e.message}`; 
  }
};

export const generateRevenueStrategy = async (m: any) => ({ analysis: "Sovereign Mode Active", tactics: [] });
export const diagnoseBuildFailure = async (l: string[]) => null;
export const generateImage = async (p: string) => null;
export const generateVideo = async (p: string) => null;
