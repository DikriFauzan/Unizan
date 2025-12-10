/**
 * Aries Accounting Stub
 * In production, this module should:
 *  - record tokens consumed per API key in Redis/Postgres
 *  - enforce quotas, decrement balances, and notify Stripe/Billing
 * For now this is a lightweight stub used by aries flows.
 */
export async function recordUsage(apiKey: string | undefined, tokens: number, meta: any = {}) {
  if (!apiKey) return;
  // owner bypass
  if (apiKey === process.env.FEAC_INTERNAL_KEY || apiKey.startsWith("FEAC-SVR-")) return;
  // TODO: persist usage to DB/Redis
  console.log("[ariesAccountingStub] recorded", { apiKey: apiKey.slice(0,12), tokens, meta });
}
