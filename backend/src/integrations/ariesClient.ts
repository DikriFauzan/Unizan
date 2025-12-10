import axios from "axios";

const ARIES_BASE = process.env.ARIES_URL || "http://localhost:8200";
const FEAC_INTERNAL_KEY = process.env.FEAC_INTERNAL_KEY || "FEAC_INTERNAL_KEY_PLACEHOLDER";

export interface AriesOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  // add more as needed
}

export async function callAries(prompt: string, opts: AriesOptions = {}, apiKey?: string) {
  // Owner bypass: if FEAC internal key or FEAC-SVR prefix, bypass token accounting
  const headers: any = {};
  if (apiKey) headers["x-api-key"] = apiKey;
  try {
    const res = await axios.post(`${ARIES_BASE}/v1/generate`, { prompt, options: opts }, { headers, timeout: 60000 });
    // Expected aries response: { text, tokens, meta }
    return res.data;
  } catch (e: any) {
    // Normalized error
    throw new Error(e?.response?.data?.error || e.message || "Aries call failed");
  }
}
