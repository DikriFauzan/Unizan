/**
 * OpenAI adapter placeholder.
 * Implement using official SDK/client with OPENAI_API_KEY.
 * Butuh riset lanjutan: choose model, tokenization, rate limits.
 */
import axios from "axios";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export default {
  async generate(prompt:string, opts:any={}) {
    // placeholder: call OpenAI completions/ChatCompletions
    const resp = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: opts.model || "gpt-4o-mini",
      messages: [{role:"user", content: prompt}],
      max_tokens: opts.max_tokens || 512
    }, {
      headers: { Authorization: `Bearer ${OPENAI_KEY}` }
    });
    return resp.data;
  }
};
