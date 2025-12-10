import { Request, Response } from "express";
export async function getBillingOverview(_req:Request,res:Response){
  // TODO: integrate with payment DB (butuh riset lanjutan)
  res.json({ ok:true, info: "billing overview placeholder" });
}
export async function topUpTokens(req:Request,res:Response){
  const { userId, amount } = req.body;
  // TODO: token accounting (butuh riset lanjutan)
  res.json({ ok:true, userId, amount });
}
