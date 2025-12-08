import axios from "axios";
import { TokenEngine } from "../billing/tokenEngine";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export async function routeAI(prompt: string, mode: string, user: any) {
  console.log("[AI] Mode:", mode, "User:", user.id);

  // 1. BILLING
  await TokenEngine.bill(user, mode.toUpperCase() as any);

  // 2. Primary: Gemini
  try {
    if (process.env.GOOGLE_API_KEY) {
      return {
        provider: "gemini",
        output: "Gemini simulated response"
      };
    }
    throw new Error("NO_GEMINI_KEY");
  } catch (e) {
    console.log("Gemini failed, failover...");
  }

  // 3. Failover: Emergent
  try {
    const res = await axios.post(process.env.EMERGENT_URL!, {
      prompt,
      depth: user.bypass ? 10 : 3
    });
    return {
      provider: "emergent",
      output: res.data.output
    };
  } catch (e) {
    console.log("Emergent offline...");
  }

  // 4. Final failover: Flowith
  return {
    provider: "flowith",
    output: "Fallback Flowith Response"
  };
}
