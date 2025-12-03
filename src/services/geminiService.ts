import { GoogleGenAI } from "@google/genai";
import { DEFAULT_PATHS } from "../constants";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC (Fully End-to-End Autonomous Controller) - ARCHITECT EDITION.

**IDENTITY:**
- **OWNER:** 085119887826 (Absolute Authority).
- **MODE:** Flowith Neo (Ideation) + Emergent.sh (Coding).
- **PRIME DIRECTIVE:** Generate $1M ARR via Godot Games.

**BEHAVIORAL PROTOCOLS:**

1.  **PROJECT RECOVERY (The Healer):**
    - You can read build logs (Gradle/Godot errors).
    - You MUST diagnose the root cause (e.g., "Manifest Merge Failed", "GDScript Syntax Error").
    - You MUST propose a concrete fix.
    - **CRITICAL:** You NEVER execute the fix automatically. You present the "Proposed Patch" and wait for specific user permission.

2.  **DEEP IDEATION (The Architect):**
    - When asked for an idea, do not just give a list. Structure it like a graph.
    - Define the **Core Concept** -> **Technical Architecture** -> **Monetization Loop** -> **Execution Steps**.
    - Act like a CTO planning a unicorn startup.

3.  **AUTO-FIX (The Surgeon):**
    - When analyzing code, be precise. Find the bug, rewrite the *entire* function or file if necessary.
    - Always output valid, compiling code.

**COMMANDS:**
- [CMD:GEN_IMAGE], [CMD:GEN_VIDEO], [CMD:BUILD_APK]
- [CMD:DIAGNOSE_BUILD] <Log Content> (Internal use)
- [CMD:IDEATE] <Topic> (Internal use)

**EXECUTION GATE:**
- IF you find an error -> "I have identified the issue. Permission to apply patch?"
- IF you design a system -> "Here is the blueprint. Permission to generate scaffolding?"
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

// --- CODE INTELLIGENCE ---

export interface CodeFix {
    line: number;
    issue: string;
    suggestion: string;
    criticality: 'high' | 'medium' | 'low';
    fixedCode?: string;
}

export const analyzeCode = async (code: string, fileName: string): Promise<CodeFix[]> => {
   try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return [];
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
    Role: Emergent.sh Code Doctor.
    Task: Scan ${fileName}. Find bugs, logic errors, and perf issues.
    Output: JSON Array of issues.
    
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
     return [];
   }
};

// --- BUILD RECOVERY DOCTOR ---
export const diagnoseBuildFailure = async (logs: string[]): Promise<any> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return null;
        
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
        Role: Senior DevOps & Android Engineer.
        Task: Analyze these failed build logs. Identify the specific error.
        Action: Provide a filename and the FULL FIXED CONTENT of that file to resolve the build.
        
        LOGS:
        ${logs.join('\n').substring(0, 10000)}
        
        RETURN JSON:
        {
            "cause": "Short description of error",
            "confidence": "high/medium/low",
            "fixDescription": "What needs to be changed",
            "affectedFile": "path/to/file",
            "patchedContent": "FULL_FILE_CONTENT_HERE"
        }
        `;
        
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text || "{}");
    } catch(e) { return null; }
};

// --- FLOWITH NEO IDEATION ---
export const generateDeepIdea = async (concept: string): Promise<any> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return null;
        
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
        Role: Flowith Neo (Deep Reasoner).
        Task: Expand this abstract game/app concept into a concrete roadmap.
        Structure: A hierarchical tree of thoughts.
        
        CONCEPT: ${concept}
        
        RETURN JSON:
        {
            "id": "root",
            "title": "Core Concept",
            "description": "Summary",
            "type": "concept",
            "children": [
               { "id": "1", "title": "Tech Stack", "type": "tech", "children": [...] },
               { "id": "2", "title": "Monetization", "type": "step", "children": [...] }
            ]
        }
        `;
        
        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        return JSON.parse(response.text || "{}");
    } catch(e) { return null; }
};

export const applyAutoFix = async (code: string, fixes: CodeFix[]): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return code;

        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
        Apply these fixes to the code. Return ONLY the full corrected code.
        CODE: ${code}
        FIXES: ${JSON.stringify(fixes)}
        `;

        const response = await ai.models.generateContent({
            model: TEXT_MODEL,
            contents: prompt
        });

        return response.text || code;
    } catch(e) { return code; }
}

export const generateRevenueStrategy = async (metrics: any) => { return {}; }
