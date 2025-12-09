import { Request, Response, NextFunction } from "express";
import { inc } from "../monitoring/metrics";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  inc('requests_total', 1);
  res.on('finish', () => {
    if (res.statusCode >= 500) inc('errors_total', 1);
  });
  next();
};
