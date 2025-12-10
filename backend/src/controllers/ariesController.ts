import { Request, Response } from "express";
import { callAries } from "../integrations/ariesClient";
import { getModelConfig } from "../integrations/aries_registry";

/**
 * POST /v1/aries/generate
 * Body: { prompt, options }
 * Header: x-api-key (optional)
 */
export async function ariesGenerate(req: Request, res: Response) {
  try {
    const apiKey = req.headers["x-api-key"] as string | undefined;
    const { prompt, options } = req.body || {};
    if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "prompt required" });

    // Choose model config (allow override)
    const modelCfg = getModelConfig(options?.model);

    // Owner bypass detection (FEAC_INTERNAL_KEY or FEAC-SVR- prefix)
    const envInternal = process.env.FEAC_INTERNAL_KEY;
    const isOwner = apiKey === envInternal || (apiKey && apiKey.startsWith("FEAC-SVR-"));

    // Calls aries client. Caller responsible for billing/token accounting (owner bypass if isOwner)
    const out = await callAries(prompt, { ...options, model: modelCfg.id }, apiKey);
    // Attach metadata about bypass
    out.meta = out.meta || {};
    out.meta.owner_bypass = !!isOwner;
    return res.json(out);
  } catch (e: any) {
    console.error("ariesGenerate error:", e.message || e);
    return res.status(500).json({ error: e.message || "aries error" });
  }
}
