import fetch from "node-fetch";

const SUPERKEY_URL = process.env.SUPERKEY_URL || "http://superkey:9100";

/**
 * Call SuperKey generate API.
 * Returns { provider, output, ... } or null on fail.
 */
export async function callSuperKey(key: string | undefined, prompt: string, modeHint?: string) {
  try {
    const res = await fetch(`${SUPERKEY_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, prompt, modeHint })
    });
    if (!res.ok) throw new Error(`SuperKey HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("SuperKey call failed:", e.message);
    return null;
  }
}

export async function superkeyHealth() {
  try {
    const res = await fetch(`${SUPERKEY_URL}/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
