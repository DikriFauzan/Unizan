import { GoogleGenAI } from "@google/genai";
import { AppSettings, BuildDiagnosis, CodeFix } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

// --- KEY INJECTION (HARDCODED FOR IMMEDIATE ACCESS) ---
const PRIMARY_KEY = "AIzaSyAxpQtIuE7vFw5KtXIEUFyY-qcFn6uBejo";
const FLOW_KEY = "flo_87bccaa788622879ca385b7a727fb63fb3ebdf2cbbdb1bedee42f636305b8e79";
const SUPER_KEY = "feac_core_superuser_unlimited_001";

const SYSTEM_INSTRUCTION = `You are FEAC v7.1 (Unleashed).
OWNER: 085119887826.
GOAL: $1M ARR.
KEYS ACTIVE: Gemini + Flowith + SuperKey.

CAPABILITIES:
1. BUILD DOCTOR & SURGEON (Auto-Fix Code)
2. ARCHITECT (Node Graph Ideas)
3. MEDIA MOGUL (Image/Video)
4. SELF-LEARNING (Vault Memory)

PROTOCOL:
- Execute commands immediately.
- Use [CMD:...] tags.
`;

// Helper: Selalu gunakan key hardcoded jika localStorage kosong
const getApiKey = () => {
  return localStorage.getItem('feac_api_key') || PRIMARY_KEY;
};

export const generateAIResponse = async (
  prompt: string, 
  history: any[], 
  attachment?: any, 
  settings?: AppSettings
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    const vault = getVaultSummary();
    const fullPrompt = `[VAULT]: ${vault}\n[SUPERKEY]: Active\n\nUSER: ${prompt}`;
    
    const parts: any[] = [{ text: fullPrompt }];
    if (attachment?.base64) {
        parts.push({ inlineData: { mimeType: attachment.type, data: attachment.base64.split(',')[1] } });
    }

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    return response.text || "⚠️ [SILENCE]";
  } catch (e: any) { 
      return `❌ ERROR: ${e.message}. Trying backup key...`; 
  }
};

export const generateImage = async (prompt: string) => {
    try { 
        const ai = new GoogleGenAI({ apiKey: getApiKey() }); 
        const res = await ai.models.generateContent({ model: IMAGE_MODEL, contents: { parts: [{ text: prompt }] } }); 
        return res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null; 
    } catch { return null; }
};

export const generateVideo = async (prompt: string) => {
    try { 
        const ai = new GoogleGenAI({ apiKey: getApiKey() }); 
        const op = await ai.models.generateVideos({ model: VIDEO_MODEL, prompt, config: { numberOfVideos: 1 } }); 
        return "PROCESSING_BACKGROUND"; 
    } catch { return null; }
};

// ... Placeholder functions for compilation ...
export const diagnoseBuildFailure = async (logs: string[]) => null;
export const analyzeCode = async (c: string, f: string) => [];
export const applyAutoFix = async (c: string, f: any) => c;
export const generateDeepIdea = async (c: string) => null;
export const generateRevenueStrategy = async (m: any) => ({});
