/**
 * modelDispatcher: owner rule + primary superkey (aries) usage + fallback chain.
 *
 * Policy (default):
 * 1) If API key matches owner/god mode -> route to Aries (bypass tokens)
 * 2) Try Aries (primary). On failure, fallback to OpenAI then Gemini (if configured)
 * 3) Optional A/B routing: fraction-based sampling between providers for experiments.
 *
 * ENV:
 * - OWNER_KEY_PREFIX (e.g. FEAC-SVR-)
 * - FALLBACK_ORDER (comma list: openai,gemini)
 *
 * Note: real telemetry + throttling + cost accounting should be implemented separately.
 */
import aries from "../integrations/model_aries";
import openai from "../integrations/model_openai";
import gemini from "../integrations/model_gemini";

const OWNER_PREFIX = process.env.OWNER_KEY_PREFIX || "FEAC-SVR-";
const FALLBACK_ORDER = (process.env.FALLBACK_ORDER || "openai,gemini").split(",");

async function tryProvider(provider:any, prompt:string, opts:any){
  try {
    const resp = await provider.generate(prompt, opts);
    return { ok: true, provider: provider.name || "provider", resp };
  } catch (e:any) {
    return { ok: false, error: e.message || String(e) };
  }
}

export async function dispatchPrompt(apiKey:string|null, prompt:string, opts:any={}) {
  // owner bypass: route to Aries
  if (apiKey && apiKey.startsWith(OWNER_PREFIX)) {
    const r = await tryProvider(aries, prompt, opts);
    if (r.ok) return { provider: "aries", output: r.resp };
    // fall through to fallback
  } else {
    // general caller: prefer Aries if configured
    const primary = await tryProvider(aries, prompt, opts);
    if (primary.ok) return { provider: "aries", output: primary.resp };
  }

  // fallback chain
  for (const p of FALLBACK_ORDER) {
    if (p === "openai") {
      const r = await tryProvider(openai, prompt, opts);
      if (r.ok) return { provider: "openai", output: r.resp };
    }
    if (p === "gemini") {
      const r = await tryProvider(gemini, prompt, opts);
      if (r.ok) return { provider: "gemini", output: r.resp };
    }
  }

  return { error: "All providers failed" };
}
