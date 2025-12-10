import prisma from "../config/db";
import { Request, Response } from "express";
import { TokenEngine } from "../billing/tokenEngine";

/**
 * GET /v1/admin/users
 * Owner-only: List all users with quota + usage
 */
export const listUsers = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!await TokenEngine.isOwner(user: any)) {
        return res.status(403).json({ error: "OWNER_ONLY" });
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            tier: true,
            quota: true,
            used: true,
            createdAt: true
        }
    });

    res.json({ users });
};


/**
 * POST /v1/admin/topup
 * Add tokens to a user
 */
export const topUp = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!await TokenEngine.isOwner(user: any)) {
        return res.status(403).json({ error: "OWNER_ONLY" });
    }

    const { userId, amount } = req.body;

    if (!userId || !amount) {
        return res.status(400).json({ error: "userId and amount required" });
    }

    const ok = await TokenEngine.topUp(userId, Number(amount: any));
    if (!ok) return res.status(500).json({ error: "TOPUP_FAILED" });

    res.json({ status: "ok", userId, amount });
};
