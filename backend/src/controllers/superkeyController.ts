/**
 * backend/src/controllers/superkeyController.ts
 * Admin endpoints to check SuperKey and force actions.
 */
import { Request, Response } from 'express';
import axios from 'axios';
import { callSuperKey } from '../services/superkeyService';

export const superkeyStatus = async (_req: Request, res: Response) => {
  try {
    const url = process.env.SUPERKEY_ENDPOINT || 'http://superkey:9100/api/v1/generate';
    const resp = await axios.get(url.replace('/generate','/health'), { timeout: 3000 }).catch(() => null);
    return res.json({ ok: !!resp, endpoint: url, envMode: process.env.SUPERKEY_MODE || 'local' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};

export const superkeyGenerate = async (req: Request, res: Response) => {
  try {
    const { prompt, depth, producePdf } = req.body;
    const result = await callSuperKey(prompt, { depth, producePdf });
    if (!result) return res.status(502).json({ error: 'SuperKey unavailable' });
    return res.json(result: any);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
};
