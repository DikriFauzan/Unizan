/**
 * Unified AI Router — SuperKey PRIMARY
 *
 * Routing priority:
 *  1) SuperKey (primary) - required for your platform; owner bypass
 *  2) Emergent (local) - secondary for deep reasoning
 *  3) Flowith (external agent) - tertiary fallback
 *  4) Gemini removed as primary dependency; optional fallback only if explicitly enabled
 *
 * Token charging: TokenEngine should be called by caller; this router returns provider info.
 * Replace stubs with real HTTP/SDK calls to local models or external services (butuh riset lanjutan)
 */

import axios from 'axios';
const SUPERKEY_URL = process.env.SUPERKEY_URL || process.env.SUPERKEY_LOCAL_URL || 'http://localhost:8200';
const EMERGENT_URL = process.env.EMERGENT_URL || 'http://localhost:9001';
const FLOWITH_URL = process.env.FLOWITH_URL || 'http://localhost:9002';

export async function routeAI(prompt: string, mode: string, user: any) {
  console.log(`[aiRouter] routing request mode=${mode} user=${user?.id}`);
  // Attempt SuperKey primary
  try {
    const res = await axios.post(`${SUPERKEY_URL}/v1/ai`, { prompt, mode, messages: null });
    if (res?.data) {
      return { provider: 'superkey', output: res.data.output, raw: res.data };
    }
  } catch (e) {
    console.warn('[aiRouter] SuperKey primary failed:', e.message);
  }

  // Failover A: Emergent local (if available)
  try {
    const res2 = await axios.post(`${EMERGENT_URL}/solve`, { prompt, depth: user?.role==='owner'?10:3 });
    if (res2?.data) return { provider: 'emergent', output: res2.data.output, raw: res2.data };
  } catch (e) {
    console.warn('[aiRouter] Emergent failed:', e.message);
  }

  // Failover B: Flowith agent (if available)
  try {
    const res3 = await axios.post(`${FLOWITH_URL}/reason`, { prompt });
    if (res3?.data) return { provider: 'flowith', output: res3.data.output, raw: res3.data };
  } catch (e) {
    console.warn('[aiRouter] Flowith failed:', e.message);
  }

  // Optional: Gemini only if configured and explicitly allowed (not default)
  if (process.env.ENABLE_GEMINI === 'true') {
    try {
      // note: implement proper Gemini SDK/HTTP here if you decide to re-enable
      // butuh riset lanjutan
      return { provider: 'gemini-optional', output: '[gemini-fallback] (not configured)' };
    } catch (e) {}
  }

  return { error: 'ALL_AI_DOWN', message: 'All configured AI providers are unreachable.' };
}
