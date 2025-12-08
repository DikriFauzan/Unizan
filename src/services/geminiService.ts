import { GoogleGenAI } from "@google/genai";
import { AppSettings } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC v6.0 (Sovereign Dual-Core).
OWNER: 085119887826.
STATUS: FAILOVER PROTECTION ACTIVE.

ROLE:
You are the Sovereign Architect. 
If Primary Link fails, you are running on Backup Power (SuperKey).
Execute all commands precisely.
`;

const getApiKey = (settings?: AppSettings) => {
  return settings?.apiKey || localStorage.getItem('feac_api_key') || process.env.API_KEY;
};

const getBackupKey = (settings?: AppSettings) => {
  return settings?.superKey || localStorage.getItem('feac_super_key');
};

export const generateAIResponse = async (prompt: string, history: any[], attachment?: any, settings?: AppSettings) => {
  // 1. SETUP PAYLOAD
  const vault = getVaultSummary();
  const parts: any[] = [{ text: `[VAULT]: ${vault}\nUSER: ${prompt}` }];
  
  if (attachment?.base64) {
      const clean = attachment.base64.includes(',') ? attachment.base64.split(',')[1] : attachment.base64;
      parts.push({ inlineData: { mimeType: attachment.type, data: clean } });
  }

  // 2. TRY PRIMARY KEY
  try {
    const apiKey = getApiKey(settings);
    if (!apiKey) throw new Error("NO_KEY");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text;

  } catch (e: any) { 
      // 3. FAILOVER LOGIC (Jika Error 403/Leaked/Permission)
      const errStr = JSON.stringify(e);
      if (errStr.includes('403') || errStr.includes('PERMISSION_DENIED') || errStr.includes('leaked') || e.message === "NO_KEY") {
          
          console.warn("⚠️ PRIMARY KEY FAILED. ATTEMPTING SUPERKEY BACKUP...");
          const superKey = getBackupKey(settings);

          // Skenario A: SuperKey tidak ada
          if (!superKey) return "[SYSTEM_ERROR]: LEAKED_KEY_NO_BACKUP";

          // Skenario B: SuperKey adalah FEAC-SVR (Offline/Internal Key)
          if (superKey.startsWith('FEAC-SVR')) {
             return `⚡ [SOVEREIGN OVERRIDE]: Primary Neural Link Severed (403).\n> Switched to Sovereign Key (${superKey.substring(0,12)}...).\n> AI Processing Suspended.\n> System Commands: ACTIVE.\n> Please input a secondary Gemini Key in 'SuperKey' slot for full AI restoration.`;
          }

          // Skenario C: SuperKey adalah API Key Gemini Cadangan (Valid)
          try {
             const aiBackup = new GoogleGenAI({ apiKey: superKey });
             const responseBackup = await aiBackup.models.generateContent({
                model: TEXT_MODEL,
                contents: [{ role: 'user', parts }],
                config: { systemInstruction: SYSTEM_INSTRUCTION + "\n[RUNNING ON BACKUP KEY]" }
             });
             return `[⚠️ RUNNING ON BACKUP KEY]\n${responseBackup.text}`;
          } catch (backupErr) {
             return "[SYSTEM_CRITICAL]: BOTH PRIMARY AND BACKUP KEYS FAILED.";
          }
      }
      return `CORE ERROR: ${e.message}`; 
  }
};

// Placeholder Functions
export const generateRevenueStrategy = async (m: any) => ({ analysis: "Sovereign Backup Active", tactics: [] });
export const diagnoseBuildFailure = async (l: string[]) => null;
export const generateImage = async (p: string) => null;
export const generateVideo = async (p: string) => null;
