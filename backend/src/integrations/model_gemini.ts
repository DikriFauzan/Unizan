/**
 * Gemini adapter placeholder (optional).
 * Configure GEMINI_KEY and GEMINI_URL as needed.
 */
import axios from "axios";
const GEMINI_KEY = process.env.GEMINI_KEY || "";

export default {
  async generate(prompt:string, opts:any={}) {
    // placeholder network call
    return { provider: "gemini", text: "gemini-placeholder-response" };
  }
};
