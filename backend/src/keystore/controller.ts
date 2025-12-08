import prisma from "../config/db";
import crypto from "crypto";
import { Request, Response } from "express";

/**
 * Keystore encryption:
 * - ENC_KEY must be 32 bytes (environment KEYSTORE_SECRET)
 * - IV must be 16 bytes; default uses a stable IV (change in production)
 *
 * NOTE: For production, use KMS and per-keystore random IVs + auth tag (GCM).
 * This implementation is a pragmatic MVP.
 */

const ENC_KEY = (process.env.KEYSTORE_SECRET || "FEAC_DEFAULT_KEY_32BYTE!!").slice(0,32);
const IV = Buffer.from((process.env.KEYSTORE_IV || "feac_super_iv_16b").padEnd(16,'0').slice(0,16));

export const uploadKeystore = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { base64, alias } = req.body;
    if (!base64 || !alias) return res.status(400).json({ error: "base64 and alias required" });

    // Encrypt keystore (AES-256-CBC)
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENC_KEY), IV);
    let encrypted = cipher.update(base64, "utf8", "base64");
    encrypted += cipher.final("base64");

    const ks = await prisma.keystore.upsert({
      where: { userId: user.id },
      update: { alias, base64: encrypted },
      create: { userId: user.id, alias, base64: encrypted }
    });

    res.json({ status: "ok", keystoreId: ks.id });
  } catch (e: any) {
    console.error("uploadKeystore:", e);
    res.status(500).json({ error: e.message });
  }
};

export const getKeystore = async (userId: string) => {
  const ks = await prisma.keystore.findUnique({ where: { userId } });
  if (!ks) return null;

  const ENC_KEY = (process.env.KEYSTORE_SECRET || "FEAC_DEFAULT_KEY_32BYTE!!").slice(0,32);
  const IV = Buffer.from((process.env.KEYSTORE_IV || "feac_super_iv_16b").padEnd(16,'0').slice(0,16));

  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENC_KEY), IV);
  let decrypted = decipher.update(ks.base64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return { alias: ks.alias, base64: decrypted };
};
