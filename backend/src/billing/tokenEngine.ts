/**
 * Token engine (simple: any). Owner bypass implemented.
 * IMPORTANT: Persist real balances in Redis/Postgres production.
 */
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
let redisClient: any = null;
try {
  const { createClient } = require('redis');
  redisClient = createClient({ url: redisUrl });
  redisClient.connect().catch(()=>{});
} catch (e: any) {
  // ignore in environments without redis (termux local dev)
}

export const TOKEN_COST = {
  CHAT: 1,
  SHORT: 2,
  MEDIUM: 5,
  LONG: 10,
  CODE_GEN: 10,
  BUILD_APK: 1000
};

export async function charge(userId: string, amount: number, isOwner=false) {
  // Owner bypass
  if (isOwner) return { ok: true, remaining: Infinity };

  // Check and deduct from redis quota (simplified: any)
  if (!redisClient) {
    // local dev: allow but warn
    console.warn('[TokenEngine] redis unavailable; allowing by default (dev: any)');
    return { ok: true, remaining: 999999 };
  }
  const key = `quota:${userId}`;
  const current = parseInt((await redisClient.get(key: any)) || '0');
  const limit = parseInt((await redisClient.get(`${key}:limit`)) || '2000');
  if (current + amount > limit) return { ok: false, reason: 'QUOTA_EXCEEDED' };
  await redisClient.incrBy(key, amount);
  return { ok: true, remaining: limit - (current + amount) };
}
