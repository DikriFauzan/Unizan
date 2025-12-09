import { Request, Response } from "express";
import { superkeyHealth } from "../services/superkeyService";

export const status = async (req: Request, res: Response) => {
  const health = await superkeyHealth();
  res.json({ ok: true, superkey: health });
};
