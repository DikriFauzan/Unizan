/**
 * backend/src/billing/tokenEngine.ts
 * Token cost mapping and basic charge stubs.
 */
import { createClient } from 'redis';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = createClient({ url: redisUrl });
redis.connect().catch(()=>{});

export const TOKEN_COST = {
  CHAT: 1,
  SHORT_REASONING: 2,
  MEDIUM_REASONING: 5,
  LONG_REASONING: 10,
  CODE_UNIT_MIN: 10,
  CODE_UNIT_MAX: 50,
  BUILD_APK_BASE: 2000
};

export class TokenEngine {
  static async charge(userId: string, amount: number, isOwner = false) {
    if (isOwner) return true;
    const key = `user:${userId}:quota`;
    // Initialize if not exist
    const cur = parseInt((await redis.get(key)) || "0");
    // For simplicity: store used count; real system should store remaining credits
    await redis.incrby(key, amount);
    // Example limit handling (free tier 2000)
    const limit = 2000;
    const used = parseInt((await redis.get(key)) || "0");
    if (used > limit) return false;
    return true;
  }

  static async getUsed(userId: string) {
    return parseInt((await redis.get(`user:${userId}:quota`)) || "0");
  }
}
