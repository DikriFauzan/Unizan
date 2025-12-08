import redis from "redis";

const client = redis.createClient({ url: process.env.REDIS_URL || "redis://redis:6379" });
client.connect();

export async function getUser(key: string) {
  const data = await client.hGetAll(`user:${key}`);
  return Object.keys(data).length ? data : null;
}

export async function createUser(key: string, tier: string) {
  await client.hSet(`user:${key}`, {
    tier,
    tokens: "0",
    status: "active",
    created: Date.now().toString(),
    updated: Date.now().toString()
  });
}

export async function updateTokens(key: string, amount: number) {
  await client.hSet(`user:${key}`, {
    tokens: String(amount),
    updated: Date.now().toString()
  });
}
