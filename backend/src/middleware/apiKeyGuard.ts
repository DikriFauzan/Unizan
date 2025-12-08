import { Request, Response, NextFunction } from 'express';
import { TokenEngine, TOKEN_COST } from '../billing/tokenEngine';

const OWNER_KEY = process.env.FEAC_INTERNAL_KEY;

export const apiKeyGuard = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers['x-api-key'] as string;

    // 1. SUPERKEY BYPASS (God Mode)
    if (key === OWNER_KEY || key?.startsWith('FEAC-SVR-')) {
        (req as any).user = { 
            id: 'owner', 
            role: 'owner', 
            tier: 'unlimited',
            bypass: true 
        };
        console.log(`[AUTH] SuperKey Access Granted: ${key.substring(0, 15)}...`);
        return next();
    }

    // 2. Normal User Logic (Stripe/Quota)
    if (!key) return res.status(401).json({ error: "Missing API Key" });
    
    // ... DB validation logic would go here ...
    (req as any).user = { id: 'public-user', role: 'user', tier: 'free' };
    next();
};

export const billTokens = (costType: keyof typeof TOKEN_COST) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (user.bypass) return next(); // Free for Owner

        const cost = TOKEN_COST[costType];
        // Charge logic
        await TokenEngine.deduct(user.id, cost);
        next();
    };
};
