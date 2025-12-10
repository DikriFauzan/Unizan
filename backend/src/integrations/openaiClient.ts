import axios from "axios";

const OPENAI_BASE = process.env.OPENAI_URL || "https://api.openai.com/v1";
const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

export interface OpenAIOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export async function callOpenAI(prompt: string, options: OpenAIOptions = {}) {
  if (!OPENAI_KEY) throw new Error("OPENAI_API_KEY missing");

  try {
    const res = await axios.post(
      `${OPENAI_BASE}/chat/completions`,
      {
        model: options.model || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: options.max_tokens || 512,
        temperature: options.temperature ?? 0.8
      },
      {
        headers: { "Authorization": `Bearer ${OPENAI_KEY}` },
        timeout: 60000
      }
    );

    const text = res.data.choices?.[0]?.message?.content || "";
    const usage = res.data.usage || {};
    return { text, usage, provider: "openai" };
  } catch (e: any) {
    throw new Error(e?.response?.data?.error?.message || e.message || "OpenAI call failed");
  }
}
