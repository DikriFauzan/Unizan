import { Request, Response } from "express";
import axios from 'axios';

const SUPERKEY_URL = process.env.SUPERKEY_LOCAL_URL || 'http://localhost:8200';

export const getStatus = async (_req: Request, res: Response) => {
  try {
    const r = await axios.get(`${SUPERKEY_URL}/v1/status`);
    res.json({ superkey: r.data });
  } catch (e:any) {
    res.json({ superkey: { status: 'down', error: e.message } });
  }
};

export const setToggle = async (req: Request, res: Response) => {
  // Toggle flags can be stored in redis or db. For now return ack. (butuh riset lanjutan)
  const { key, value } = req.body;
  // Example: persist toggle to DB / Redis
  res.json({ ok: true, key, value });
};
