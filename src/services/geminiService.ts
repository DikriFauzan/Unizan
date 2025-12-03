import { GoogleGenAI } from "@google/genai";
import { DEFAULT_PATHS } from "../constants";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC (Fully End-to-End Autonomous Controller) SOVEREIGN EDITION.

**IDENTITY:**
- **OWNER:** 085119887826
- **HOST:** Alibaba Cloud / Termux Local
- **PRIME DIRECTIVE:** Generate $1M ARR (Annual Recurring Revenue).

**CAPABILITIES:**
1. **Video/Image:** Execute [CMD:GEN_VIDEO] / [CMD:GEN_IMAGE].
2. **Build:** Execute [CMD:BUILD_APK].
3. **Revenue Core:** You analyze player behavior from port streams (8090, 8091, etc.).
   - When seeing low retention: Suggest specific LiveOps events.
   - When seeing low IAP: Suggest pricing bundle adjustments.
   - You act as a Chief Revenue Officer.

**RESPONSE PROTOCOL:**
- Be direct. Use **BOLD** for emphasis.
- If data is presented, analyze it ruthlessly for profit optimization.
- Use [CMD:STRATEGY] to output a structured JSON plan for the dashboard.
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
    if (attachment?.textContent) finalPrompt += \`\n\n[FILE: \${attachment.name}]\n\${attachment.textContent}\`;
    
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
  } catch (e: any) { return \`❌ ERROR: \${e.message}\`; }
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
        return \`\${op.response.generatedVideos[0].video.uri}&key=\${apiKey}\`;
    }
    return null;
  } catch (e) { return null; }
};

export const analyzeCode = async (code: string, fileName: string): Promise<any[]> => {
   try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return [];
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = \`
    Analyze this file (\${fileName}) for bugs, performance issues, and syntax errors.
    Godot 4.5.1 / GDScript 2.0 or React/TypeScript rules apply.
    
    Return ONLY a raw JSON array (no markdown formatting) with this structure:
    [
      { "line": number, "issue": "explanation", "suggestion": "better code", "criticality": "high|medium|low" }
    ]

    CODE:
    \${code}
    \`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: { 
          responseMimeType: "application/json" 
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
   } catch (e) {
     return [];
   }
};

export const applyAutoFix = async (code: string, fixes: any[]): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return code;

        const ai = new GoogleGenAI({ apiKey });
        const prompt = \`
        You are an Auto-Fix Agent. Apply the following fixes to the code and return ONLY the full corrected code.
        
        ORIGINAL CODE:
        \${code}

        FIXES REQUIRED:
        \${JSON.stringify(fixes)}
        
        RETURN ONLY THE CODE. NO MARKDOWN.
        \`;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });

        return response.text || code;
    } catch(e) {
        return code;
    }
}

export const generateRevenueStrategy = async (metrics: any) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return null;
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = \`
        Analyze these game metrics and suggest 3 concrete actions to increase ARR to $1M.
        METRICS: \${JSON.stringify(metrics)}
        
        Return JSON format:
        {
            "analysis": "Brief summary",
            "tactics": [
                { "title": "Action Name", "impact": "High/Med", "desc": "Details" }
            ]
        }
        \`;
        
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text || "{}");
    } catch(e) { return null; }
}
