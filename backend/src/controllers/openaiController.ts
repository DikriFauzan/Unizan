import { Request, Response } from "express";
import { callOpenAI } from "../integrations/openaiClient";
import { billTokens } from "../services/billingEngine";

export async function openAIGenerate(req: Request, res: Response) {
  try {
    const { prompt, options } = req.body;
    const apiKey = req.headers["x-api-key"] as string | undefined;

    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const result = await callOpenAI(prompt, options);
    await billTokens(apiKey, result.usage);

    return res.json(result);
  } catch (e: any) {
    console.error("openAIGenerate error", e);
    return res.status(500).json({ error: e.message });
  }
}
