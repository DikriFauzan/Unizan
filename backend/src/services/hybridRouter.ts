import { callAries } from "./providerAries";
import { callOpenAI } from "../integrations/openaiClient";

let scoreAries = 100;
let scoreOpenAI = 100;

export async function hybridGenerate(prompt: string, apiKey?: string) {
  const t0 = Date.now();

  // Aries PRIMARY
  try {
    const result = await callAries(prompt, apiKey);
    const latency = Date.now() - t0;
    scoreAries = Math.max(10, scoreAries - latency * 0.05);  
    scoreOpenAI = scoreOpenAI + 1;

    return { ...result, latency };
  } catch (err) {
    console.log("[hybrid] Aries failed → fallback:", err.message);
    scoreAries += 5;   
  }

  // FALLBACK — OpenAI
  const t1 = Date.now();
  try {
    const result = await callOpenAI(prompt);
    const latency = Date.now() - t1;
    scoreOpenAI = Math.max(10, scoreOpenAI - latency * 0.05);

    return { ...result, latency };
  } catch (err: any) {
    throw new Error("Both Aries & OpenAI failed: " + err.message);
  }
}

export function providerScores() {
  return { scoreAries, scoreOpenAI };
}
