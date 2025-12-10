import axios from "axios";

const ARIES_URL = process.env.ARIES_URL || "http://localhost:8200/v1";

export async function callAries(prompt: string, apiKey?: string) {
  try {
    const res = await axios.post(
      `${ARIES_URL}/generate`,
      { prompt },
      {
        timeout: 60000,
        headers: apiKey ? { "x-api-key": apiKey } : {}
      }
    );

    return {
      text: res.data?.text || res.data?.output || "",
      usage: res.data?.usage || { total_tokens: res.data?.tokens || 0 },
      provider: "aries"
    };
  } catch (e: any) {
    throw new Error(e?.response?.data?.error || e.message || "Aries error");
  }
}
