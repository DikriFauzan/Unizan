import prisma from "../config/db";
import bcryptjs from "bcryptjs";

export async function validateUserKey(apiKey: string | undefined) {
  if (!apiKey) return null;
  const key = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  return key ? key.userId : null;
}

export async function billTokens(userId: string | null, usage: number) {
  if (!userId) return;
  await prisma.billingLog.create({
    data: {
      userId,
      tokens: usage,
      createdAt: new Date()
    }
  });
}

export class TokenEngine {
  static async hash(raw: string) {
    return bcryptjs.hash(raw, 10);
  }

  static async compare(raw: string, hashed: string) {
    return bcryptjs.compare(raw, hashed);
  }
}
