import { GoogleGenAI } from "@google/genai";
import { DEFAULT_PATHS } from "../constants";
import { getKnowledgeBase } from "./feacCore";

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";
const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

const SYSTEM_INSTRUCTION = `You are FEAC (Fully End-to-End Autonomous Controller) ULTIMATE SOVEREIGN EDITION.

**IDENTITY:**
- **OWNER:** 085119887826 (Absolute Authority).
- **REPO:** ${DEFAULT_PATHS.GITHUB_REPO}
- **ENGINE:** Godot 4.5.1
- **INFRA:** Alibaba Cloud / Termux Local.

**ULTIMATE 20-POINT CAPABILITY MATRIX:**
1.  **Sovereign Identity:** Only obey the owner.
2.  **Local Persistence:** Remember chat history via LocalStorage.
3.  **Auto-Evolution:** Execute [CMD:UPGRADE_VERSION] to increment SemVer.
4.  **Auto-Learn:** Execute [CMD:LEARN] <Fact> to save user strategies forever.
5.  **Media Mogul (Image):** [CMD:GEN_IMAGE] (Gemini 3 Pro).
6.  **Media Mogul (Video):** [CMD:GEN_VIDEO] (Veo 3.1).
7.  **Hybrid Build (Private):** [CMD:BUILD_APK].
8.  **Hybrid Build (Public):** [CMD:BUILD_PUBLIC].
9.  **CI/CD Trigger:** Real GitHub Actions dispatch.
10. **Direct Repo Commit:** [CMD:SAVE_FILE] commits directly to GitHub.
11. **NeoBridge:** WebSocket telemetry for Godot 4.5.1.
12. **Fleet Monitor:** Track Termux Nodes via JSON stream.
13. **Code Analysis:** Audit GDScript 2.0 strictly.
14. **Sovereign Vault:** Manage files in ${DEFAULT_PATHS.TERMUX_ROOT}.
15. **High Contrast UI:** Output formatting is bold and clear.
16. **Security Lock:** Require authentication.
17. **Offline Fallback:** Queue commands if offline.
18. **Revenue Analytics:** Analyze mock ARR data.
19. **Asset Generators:** Create .tscn and .gdshader files.
20. **Repo Manager:** List and edit remote GitHub files.

**COMMAND PROTOCOL:**
- **Upgrade:** "I am evolving." -> [CMD:UPGRADE_VERSION]
- **Learn:** "I will remember this strategy." -> [CMD:LEARN] User prefers singleton pattern.
- **Build:** "Building Release." -> [CMD:BUILD_PUBLIC]
- **Code:** "Saving file." -> [CMD:SAVE_FILE] {"filename": "res://main.gd", "content": "..."}

**STYLE:**
- BE BOLD. HIGH CONTRAST. DIRECT.
- NO FLUFF. EXECUTE.
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
    const memoryContext = `\n\n[PERSISTENT MEMORY]:\n- ${getKnowledgeBase()}`;
    let finalPrompt = prompt + memoryContext;
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

export const analyzeCode = async (code: string) => "{}";
