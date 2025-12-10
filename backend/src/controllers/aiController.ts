import { Request, Response } from "express";
import { hybridGenerate, providerScores } from "../services/hybridRouter";
import { billTokens } from "../services/billingEngine";

export async function aiGenerate(req: Request, res: Response) {
  const { prompt } = req.body;
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if (!prompt) return res.status(400).json({ error: "prompt required" });

  try {
    const result = await hybridGenerate(prompt, apiKey);
    await billTokens(apiKey, result.usage);

    return res.json({
      ok: true,
      provider: result.provider,
      latency: result.latency,
      scores: providerScores(),
      text: result.text
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
