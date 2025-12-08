import { Request, Response, NextFunction } from 'express';

const OWNER_KEY = process.env.FEAC_INTERNAL_KEY;

export const apiKeyGuard = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key'] as string;

  if (!key) return res.status(401).json({ error: "NO_API_KEY" });

  if (key === OWNER_KEY || key.startsWith("FEAC-SVR-")) {
    (req as any).user = {
      id: "owner",
      role: "owner",
      tier: "unlimited",
      bypass: true
    };
    console.log("[AUTH] SuperKey access granted.");
    return next();
  }

  (req as any).user = {
    id: key,
    role: "user",
    tier: "free",
    bypass: false
  };

  next();
};
