import { Request, Response } from "express";
import { dispatchPrompt } from "../services/modelDispatcher";
import { evaluateResponse } from "../services/evaluator";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

/**
 * Unified generate endpoint:
 * - Protected by apiKeyGuard which also attaches req.apiKey (if available)
 * - Calls dispatcher, then evaluator, returns structured payload
 */
export const generate = async (req:Request, res:Response) => {
  try {
    const apiKey = (req as any).apiKey || null;
    const { prompt, options } = req.body;
    const dis = await dispatchPrompt(apiKey, prompt, options || {});
    if (dis.error) return res.status(502).json({ error: dis.error });

    const evalRes = await evaluateResponse(prompt, dis.output);
    // telemetry hook (fire-and-forget)
    try {
      // send metrics to metrics collector (implement separately)
      const axios = require("axios");
      axios.post(process.env.METRICS_COLLECTOR || "http://localhost:9000/metrics", { provider: dis.provider, score: evalRes.score }).catch(()=>{});
    } catch(e){}

    res.json({ provider: dis.provider, response: dis.output, evaluation: evalRes });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
};
