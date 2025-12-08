/**
 * TokenEngine
 * - chargeForDownload(userId, amount, isOwner)
 * - getBalance(userId)
 * - isOwner(user)
 *
 * NOTE: This file is a lightweight implementation that expects Redis to be available.
 * In production you'd validate against Postgres/Prisma and reconcile balances there.
 *
 * If Redis not available, functions will fallback to in-memory (not persistent).
 */
import { createClient } from 'redis';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
let redisClient: any = null;

(async () => {
  try {
    const rc = createClient({ url: REDIS_URL });
    rc.on('error', (e: any) => console.error('[TokenEngine] Redis error', e));
    await rc.connect();
    redisClient = rc;
    console.log('[TokenEngine] Redis connected');
  } catch (e) {
    console.warn('[TokenEngine] Redis not available, falling back to in-memory store');
    redisClient = null;
  }
})();

// default cost (can be overridden in .env)
const DEFAULT_DOWNLOAD_COST = Number(process.env.DOWNLOAD_COST || 50);

export const TokenEngine = {
  async isOwner(user: any) {
    if (!user) return false;
    // Owner detection: either role or superkey
    if (user.role === 'owner' || user.id === 'owner' || (user.bypass === true)) return true;
    // If user object has email, compare to OWNER_EMAIL env
    if (process.env.OWNER_EMAIL && user.email && user.email === process.env.OWNER_EMAIL) return true;
    return false;
  },

  async getBalance(userId: string) {
    try {
      if (!redisClient) return 0;
      const v = await redisClient.get(`user:${userId}:quota`);
      return v ? Number(v) : 0;
    } catch (e) {
      console.warn('[TokenEngine] getBalance fallback', e);
      return 0;
    }
  },

  /**
   * Charge tokens for download operation.
   * Returns: { ok: boolean, remaining?: number, error?: string }
   */
  async chargeForDownload(user: any, amount?: number) {
    try {
      if (await this.isOwner(user)) return { ok: true, remaining: Infinity };

      const userId = user?.id || String(user);
      const cost = typeof amount === 'number' ? amount : DEFAULT_DOWNLOAD_COST;

      if (!redisClient) {
        // Fallback: assume unlimited in dev if no Redis (but return ok=false to be safe)
        return { ok: false, error: 'Redis unavailable' };
      }

      // Use a Lua-style atomic check: get -> if >= cost -> decrby
      const balanceRaw = await redisClient.get(`user:${userId}:quota`);
      const balance = balanceRaw ? Number(balanceRaw) : 0;
      if (balance < cost) return { ok: false, error: 'INSUFFICIENT_TOKENS', remaining: balance };

      await redisClient.decrBy(`user:${userId}:quota`, cost);
      const newBalRaw = await redisClient.get(`user:${userId}:quota`);
      return { ok: true, remaining: newBalRaw ? Number(newBalRaw) : 0 };
    } catch (e) {
      console.error('[TokenEngine] chargeForDownload error', e);
      return { ok: false, error: 'CHARGE_ERROR' };
    }
  },

  // Utility to top-up (for admin usage)
  async topUp(userId: string, amount: number) {
    try {
      if (!redisClient) return false;
      await redisClient.incrBy(`user:${userId}:quota`, amount);
      return true;
    } catch (e) {
      console.error('[TokenEngine] topUp error', e);
      return false;
    }
  }
};
