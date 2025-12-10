import { Request, Response } from "express";
import { getShortTerm } from "../services/emer-memory";
import prisma from "../config/db";

export const status = async (_req: Request, res: Response) => {
  const recent = getShortTerm(50);
  // long term count
  let count = 0;
  try { count = (await prisma.emergentMemory.count()) || 0; } catch(e){}
  res.json({ shortTerm: recent, longTermCount: count });
};
