import { Request, Response, NextFunction } from "express";

/**
 * If x-api-key present, validate token and set (req as any).user
 * Otherwise continue without rejecting (optional).
 * Replace token validation with real DB/Redis verification in production.
 */
export async function apiKeyGuardOptional(req: Request, _res: Response, next: NextFunction) {
  const key = (req.headers["x-api-key"] || req.headers["x-internal-key"]) as string | undefined;
  if (!key) return next();
  try {
    // lightweight owner check placeholder
    if (key === process.env.FEAC_INTERNAL_KEY || key.startsWith("FEAC-SVR-")) {
      (req as any).user = { id: "owner", role: "owner", key };
      return next();
    }
    // TODO: real lookup (prisma / redis)
    (req as any).user = { id: "user:"+key.slice(0,8), role: "user", key };
    return next();
  } catch (e: any) {
    console.warn("apiKeyGuardOptional error", e);
    return next();
  }
}
