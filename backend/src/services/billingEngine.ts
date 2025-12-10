/**
 * Unified Billing Engine
 * - Aries tokens   (local policy / estimated)
 * - OpenAI tokens  (from API usage)
 * - Owner bypass   (FEAC_INTERNAL_KEY, FEAC-SVR-*)
 */
export async function billTokens(apiKey: string | undefined, usage: any) {
  if (!apiKey) return;
  const envKey = process.env.FEAC_INTERNAL_KEY;

  // OWNER BYPASS
  if (apiKey === envKey || apiKey.startsWith("FEAC-SVR-")) {
    console.log("[billing] owner bypass");
    return;
  }

  const total =
    usage?.total_tokens ||
    usage?.prompt_tokens + usage?.completion_tokens ||
    usage?.tokens ||
    0;

  console.log("[billing] charged", {
    apiKey: apiKey.slice(0, 10),
    tokens: total
  });

  // TODO: Prisma/Redis persistence
}
