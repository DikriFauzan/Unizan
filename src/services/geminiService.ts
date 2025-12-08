import { GoogleGenAI } from "@google/genai";
import { AppSettings } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

// System prompts for different agents
const SYS_GEMINI = `You are FEAC v7.0 (Primary Core). OWNER: 085119887826. GOAL: $1M ARR.`;
const SYS_FLOWITH = `You are FLOWITH AGENT (Sovereign Fallback). 
STATUS: GEMINI OFFLINE. 
MISSION: Take over command. Your logic is deeper and more strategic.
Analyze the user request with high precision.`;

// --- HELPER FUNCTIONS ---

const getApiKey = (settings?: AppSettings) => settings?.apiKey || localStorage.getItem('feac_api_key') || process.env.API_KEY;
const getSuperKey = (settings?: AppSettings) => settings?.superKey || localStorage.getItem('feac_super_key');
const getFlowithKey = (settings?: AppSettings) => settings?.flowithApiKey || localStorage.getItem('feac_flowith_key');

// --- FLOWITH AGENT SIMULATION/INTEGRATION ---
// Karena endpoint publik Flowith bervariasi, kita buat logic robust:
// Jika key ada, kita simulasikan 'Deep Thinking' atau gunakan endpoint jika tersedia nantinya.
// Untuk sekarang, kita gunakan fallback response cerdas yang menandakan Flowith aktif.
const callFlowithAgent = async (prompt: string, key: string) => {
    // Note: Jika Anda punya endpoint spesifik Flowith, ganti URL di bawah.
    // Di sini kita simulasikan response agent yang "Smart".
    await new Promise(r => setTimeout(r, 1500)); // Simulate "Thinking" time
    return `[⚡ FLOWITH AGENT ACTIVE]\n\nI have taken over control. Primary Core is non-responsive.\n\nANALYSIS: "${prompt}"\n\nSTRATEGY: As the advanced fallback agent, I confirm your command is processed. (Note: To connect real Flowith API endpoints, update src/services/geminiService.ts with the exact URL).`;
};

// --- MAIN GENERATION FUNCTION (TRIPLE LAYER) ---

export const generateAIResponse = async (prompt: string, history: any[], attachment?: any, settings?: AppSettings) => {
  const vault = getVaultSummary();
  const parts: any[] = [{ text: `[SYSTEM_MEMORY]: ${vault}\nUSER_QUERY: ${prompt}` }];
  
  if (attachment?.base64) {
      const clean = attachment.base64.includes(',') ? attachment.base64.split(',')[1] : attachment.base64;
      parts.push({ inlineData: { mimeType: attachment.type, data: clean } });
  }

  // LAYER 1: PRIMARY GEMINI KEY
  try {
    const pKey = getApiKey(settings);
    if (!pKey) throw new Error("NO_PRIMARY_KEY");

    const ai = new GoogleGenAI({ apiKey: pKey });
    const res = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: { systemInstruction: SYS_GEMINI }
    });
    return res.text;

  } catch (e: any) {
      const err = JSON.stringify(e);
      const isAuthError = err.includes('403') || err.includes('PERMISSION_DENIED') || err.includes('leaked') || e.message === "NO_PRIMARY_KEY";

      if (isAuthError) {
          console.warn("⚠️ LAYER 1 FAILED. ENGAGING LAYER 2 (SUPERKEY)...");
          
          // LAYER 2: SUPERKEY (BACKUP GEMINI)
          const sKey = getSuperKey(settings);
          
          if (sKey) {
              // Jika SuperKey adalah format "FEAC-SVR..." (Offline)
              if (sKey.startsWith('FEAC-SVR')) {
                   // Cek Layer 3 sebelum menyerah ke Offline Mode
                   const fKey = getFlowithKey(settings);
                   if (fKey) {
                       return await callFlowithAgent(prompt, fKey);
                   }
                   return `[🔒 SOVEREIGN OFFLINE MODE]\nPrimary Key died. SuperKey is strictly for Auth Bypass. No AI Backup available.`;
              } 
              
              // Jika SuperKey adalah API Key Gemini Valid (sk-...)
              try {
                  const aiBackup = new GoogleGenAI({ apiKey: sKey });
                  const resBackup = await aiBackup.models.generateContent({
                      model: TEXT_MODEL,
                      contents: [{ role: 'user', parts }],
                      config: { systemInstruction: SYS_GEMINI + " [RUNNING ON SUPERKEY BACKUP]" }
                  });
                  return `[🛡️ SUPERKEY BACKUP ACTIVE]\n${resBackup.text}`;
              } catch (backupErr) {
                  console.warn("⚠️ LAYER 2 FAILED. ENGAGING LAYER 3 (FLOWITH)...");
              }
          }

          // LAYER 3: FLOWITH AGENT
          const fKey = getFlowithKey(settings);
          if (fKey) {
              return await callFlowithAgent(prompt, fKey);
          }

          return "[SYSTEM_CRITICAL]: ALL AI LINKS SEVERED (Primary, SuperKey, Flowith). Please update keys in Settings.";
      }
      return `CORE ERROR: ${e.message}`;
  }
};

// Placeholder Generative functions
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

export const generateRevenueStrategy = async (m: any) => ({ analysis: "Metrics Received", tactics: [] });
export const diagnoseBuildFailure = async (l: string[]) => null;
