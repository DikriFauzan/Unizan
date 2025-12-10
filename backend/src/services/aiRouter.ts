import axios from 'axios';
import { validateUserKey } from './tokenEngine';    // token engine existing
import { logAriesFallback } from './logger';        // we add this in GEN21
import dotenv from 'dotenv';
dotenv.config();

const ARIES_URL = process.env.ARIES_URL || "http://127.0.0.1:8200/v1/query";
const GEMINI_URL = process.env.GEMINI_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText";
const FLOWITH_URL = process.env.FLOWITH_URL || "https://api.flowith.ai/v1/complete";

// Notes:
// Aries = primary
// Gemini & Flowith = secondary fallback boosters

export async function routeAI(prompt: string, userKey: string, model: string = "aries") {

  // 1. Owner + God-Mode Bypass
  const keyStatus = validateUserKey(userKey);
  const allowFree = keyStatus.isOwner || keyStatus.isInternal;

  // 2. Force Aries as primary provider
  try {
    const res = await axios.post(ARIES_URL, {
      prompt,
      model: model || "aries-ultra",
      max_tokens: 4096
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.FEAC_INTERNAL_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!allowFree) keyStatus.consumeTokens(res.data.token_usage || 1000);
    return res.data;

  } catch (err) {
    logAriesFallback(prompt, err);
    console.log("[GEN21] Aries failed, trying Gemini → Flowith booster cascade...");
  }

  // 3. Gemini fallback
  try {
    const g = await axios.post(GEMINI_URL + "?key=" + process.env.GEMINI_KEY, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    return g.data;
  } catch (gerr) {
    console.log("[GEN21] Gemini failed => last fallback to Flowith...");
  }

  // 4. Flowith fallback
  try {
    const f = await axios.post(FLOWITH_URL, {
      model: "flowith-pro",
      prompt: prompt
    }, { headers: { "Authorization": "Bearer " + process.env.FLOWITH_KEY }});
    return f.data;
  } catch (ferr) {
    return { error: "All providers failed: Aries → Gemini → Flowith." };
  }
}
