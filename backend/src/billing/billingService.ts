import prisma from "../config/db";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch(() => {});

export class BillingService {

    // OWNER ALWAYS BYPASS
    static isOwner(user: any) {
        return user?.role === "owner" || user?.bypass === true;
    }

    // Charge tokens
    static async charge(user: any, amount: number): Promise<boolean> {
        if (this.isOwner(user)) return true;

        const key = `usage:${user.id}`;
        const current = Number(await redis.get(key) || 0);

        const newUsage = current + amount;
        await redis.set(key, newUsage);

        const limit = user.tier === "pro" ? 10000 : 2000;
        return newUsage <= limit;
    }

    static async getUsage(userId: string) {
        const usage = await redis.get(`usage:${userId}`);
        return Number(usage || 0);
    }

    static async resetUsage(userId: string) {
        await redis.set(`usage:${userId}`, 0);
    }
}
