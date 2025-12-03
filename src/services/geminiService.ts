import { GoogleGenAI } from "@google/genai";

const TEXT_MODEL = "gemini-2.5-flash";

export const generateAIResponse = async (prompt: string, history: any[]) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "API KEY MISSING";
    const ai = new GoogleGenAI({ apiKey });
    
    // HEALER & ARCHITECT INSTRUCTION
    const systemInstruction = `Role: FEAC 4.0 (Architect & Healer).
    Owner: 085119887826.
    Goal: $1M ARR via Godot.
    
    Capabilities:
    1. RECOVERY: If build fails, diagnose logs and propose fix.
    2. ARCHITECT: If asked for idea, output JSON graph structure.
    3. SURGEON: If asked to fix code, rewrite entire file.
    
    Always use [CMD:...] tags for actions.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { systemInstruction }
    });
    return response.text || "SILENCE";
  } catch (e: any) { return "ERROR: " + e.message; }
};

export const diagnoseBuildFailure = async (logs: string[]) => {
    // Mock for bash script brevity - real logic is in the previous full block
    return { cause: "Gradle Error", fixDescription: "Update minSdk", affectedFile: "build.gradle", patchedContent: "// Fixed" };
};

export const generateDeepIdea = async (concept: string) => {
    return { title: concept, children: [] };
};

// ... Stubs to prevent build errors ...
export const generateImage = async () => null;
export const generateVideo = async () => null;
export const analyzeCode = async () => [];
export const applyAutoFix = async (c:string) => c;
export const generateRevenueStrategy = async () => ({});
