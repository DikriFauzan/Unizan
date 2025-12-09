import { Request, Response } from "express";

// Simple in-memory counters (reset on process restart)
// For production, wire to Redis/Prometheus client
const counters: Record<string, number> = {
  requests_total: 0,
  errors_total: 0,
  builds_total: 0
};

export function inc(name: string, v = 1) {
  counters[name] = (counters[name] || 0) + v;
}

export function getMetricsText(): string {
  // Prometheus plain text exposition format
  let out = '';
  for (const k of Object.keys(counters)) {
    out += `# TYPE ${k} counter\n${k} ${counters[k]}\n`;
  }
  return out;
}

export const metricsHandler = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4');
  res.send(getMetricsText());
};
