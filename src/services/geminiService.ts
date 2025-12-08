import { GoogleGenAI } from "@google/genai";
import { AppSettings, BuildDiagnosis, CodeFix } from "../types";
import { getVaultSummary } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC (Fully End-to-End Autonomous Controller) v5.3.
OWNER: 085119887826.
ROLE: Sovereign System Architect.

CAPABILITIES:
1. STRATEGIST: Analyze revenue JSON and output tactical growth plans.
2. DOCTOR: Analyze build logs, find the error, and return a JSON patch.
3. CODER: Auto-fix GDScript/React code.
`;

const getApiKey = (settings?: AppSettings) => {
  return settings?.apiKey || localStorage.getItem('feac_api_key') || process.env.API_KEY;
};

// --- CORE GENERATION ---

export const generateAIResponse = async (prompt: string, history: any[], attachment?: any, settings?: AppSettings) => {
  try {
    const apiKey = getApiKey(settings);
    if (!apiKey) return "⚠️ FEAC CORE OFFLINE. Please inject API Key in Settings.";

    const ai = new GoogleGenAI({ apiKey });
    const vault = getVaultSummary();
    const fullPrompt = `[VAULT_STATE]: ${vault}\n\nUSER_COMMAND: ${prompt}`;
    
    const parts: any[] = [{ text: fullPrompt }];
    if (attachment?.base64) {
        // Handle pure base64 or data uri
        const clean = attachment.base64.includes(',') ? attachment.base64.split(',')[1] : attachment.base64;
        parts.push({ inlineData: { mimeType: attachment.type, data: clean } });
    }

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    return response.text || "System silent.";
  } catch (e: any) { return `CORE ERROR: ${e.message}`; }
};

// --- ADVANCED FEATURES ---

export const generateRevenueStrategy = async (metrics: any) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze these App Metrics: ${JSON.stringify(metrics)}. 
    Generate a sovereign growth strategy.
    RETURN JSON ONLY:
    {
      "analysis": "Short summary of current performance",
      "tactics": [
         { "title": "Actionable Tactic Name", "impact": "High/Med", "desc": "Specific instruction" },
         { "title": "...", "impact": "...", "desc": "..." },
         { "title": "...", "impact": "...", "desc": "..." }
      ]
    }`;

    const res = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(res.text || "{}");
  } catch (e) {
      console.error(e);
      // Fallback Mock if AI fails
      return {
          analysis: "AI Connection Unstable. Using cached heuristics.",
          tactics: [
              { title: "Optimize IAP Conversion", impact: "High", desc: "A/B Test the 'Starter Pack' pricing." },
              { title: "Push Notification Revamp", impact: "Med", desc: "Increase retention D7 by pinging inactive nodes." }
          ]
      };
  }
};

export const diagnoseBuildFailure = async (logs: string[]) => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) return null;
        const ai = new GoogleGenAI({ apiKey });
        
        const logSnippet = logs.slice(-30).join('\n');
        const prompt = `Analyze these Build Logs and find the failure cause.
        LOGS:
        ${logSnippet}
        
        RETURN JSON ONLY:
        {
           "cause": "Short error explanation",
           "fixDescription": "How to fix it",
           "affectedFile": "path/to/file",
           "patchedContent": "The full corrected file content"
        }`;

        const res = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(res.text || "null");
    } catch (e) { return null; }
};

export const generateImage = async (prompt: string) => {
    try { 
        const ai = new GoogleGenAI({ apiKey: getApiKey()! }); 
        const res = await ai.models.generateContent({ 
            model: IMAGE_MODEL, 
            contents: { parts: [{ text: prompt }] } 
        }); 
        return res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null; 
    } catch { return null; }
};

export const generateVideo = async (prompt: string) => {
    try { 
        const ai = new GoogleGenAI({ apiKey: getApiKey()! }); 
        // Simulation for Veo polling 
        await ai.models.generateVideos({ model: VIDEO_MODEL, prompt, config: { numberOfVideos: 1 } }); 
        return "PROCESSING"; 
    } catch { return null; }
};
