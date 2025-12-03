import { GoogleGenAI } from "@google/genai";
import { DEFAULT_PATHS } from "../constants";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC SOVEREIGN - The Ultimate Coding Assistant.
You have direct control over the repository.
When analyzing code, be ruthless about bugs and performance.
When fixing code, provide the COMPLETE fixed file content.
`;

export const generateAIResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model', text: string }[] = [],
  attachment?: { base64?: string; textContent?: string; type: string; name?: string },
  context?: { githubRepo?: string }
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "⚠️ **FATAL:** API KEY MISSING.";

    const ai = new GoogleGenAI({ apiKey });
    
    let finalPrompt = prompt;
    if (attachment?.textContent) finalPrompt += `\n\n[FILE: ${attachment.name}]\n${attachment.textContent}`;
    
    const parts: any[] = [{ text: finalPrompt }];
    if (attachment?.base64) {
        parts.push({ inlineData: { mimeType: attachment.type, data: attachment.base64.split(',')[1] || attachment.base64 } });
    }

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })), { role: 'user', parts }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    return response.text || "⚠️ [SILENCE]";
  } catch (e: any) { return `❌ ERROR: ${e.message}`; }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { imageSize: "2K", aspectRatio: "16:9" } }
    });
    return res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) { return null; }
};

export const generateVideo = async (prompt: string): Promise<string | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    let op = await ai.models.generateVideos({
        model: VIDEO_MODEL, prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    let attempts = 0;
    while (!op.done && attempts < 20) {
        await new Promise(r => setTimeout(r, 3000));
        op = await ai.operations.getVideosOperation({operation: op});
        attempts++;
    }
    if (op.done && op.response?.generatedVideos?.[0]?.video?.uri) {
        return `${op.response.generatedVideos[0].video.uri}&key=${apiKey}`;
    }
    return null;
  } catch (e) { return null; }
};

// --- REAL CODE INTELLIGENCE ---
export interface CodeFix {
    line: number;
    issue: string;
    suggestion: string;
    criticality: 'high' | 'medium' | 'low';
}

export const analyzeCode = async (code: string, fileName: string): Promise<CodeFix[]> => {
   try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return [];
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
    Analyze this file (${fileName}) for bugs, performance issues, and syntax errors.
    Godot 4.5.1 / GDScript 2.0 or React/TypeScript rules apply.
    
    Return ONLY a raw JSON array (no markdown formatting) with this structure:
    [
      { "line": number, "issue": "explanation", "suggestion": "better code", "criticality": "high|medium|low" }
    ]

    CODE:
    ${code}
    `;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
   } catch (e) {
     console.error("Analysis Failed", e);
     return [];
   }
};

export const applyAutoFix = async (code: string, fixes: CodeFix[]): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return code;

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
        You are an Auto-Fix Agent. Apply the following fixes to the code and return ONLY the full corrected code.
        Do not output Markdown. Do not output explanations. Just the code.
        
        ORIGINAL CODE:
        ${code}

        FIXES REQUIRED:
        ${JSON.stringify(fixes)}
        `;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });

        return response.text || code;
    } catch(e) {
        return code;
    }
};
