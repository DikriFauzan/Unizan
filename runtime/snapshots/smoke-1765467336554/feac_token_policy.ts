/**
 * FEAC TOKEN POLICY ENGINE — STEP 8
 * Memastikan setiap perintah runtime tunduk pada validasi token.
 * Mendukung owner-bypass, privilege-level, audit.
 */

export type AccessLevel = "owner" | "privileged" | "service" | "guest" | "blocked";

export interface PolicyResult {
  allowed: boolean;
  level: AccessLevel;
  reason?: string;
}

const OWNER_KEY = process.env.FEAC_OWNER_KEY || "";
const PRIV_KEYS = (process.env.FEAC_PRIV_KEYS || "").split(",").filter(x => x);

/**
 * POLICY RULE:
 * - Owner (god-mode)   -> akses penuh
 * - Privileged keys    -> boleh semua kecuali core-system edits
 * - Service tokens     -> hanya API uci.* & runtime.*
 * - Guest tokens       -> hanya command publik
 */

export function evaluateToken(token: string | null, command: string): PolicyResult {
  if (!token || token.trim() === "") {
    return { allowed: false, level: "blocked", reason: "no token" };
  }

  // owner override
  if (token === OWNER_KEY) {
    return { allowed: true, level: "owner" };
  }

  // privileged
  if (PRIV_KEYS.includes(token)) {
    if (command.startsWith("system.") || command.startsWith("admin.root")) {
      return { allowed: false, level: "privileged", reason: "restricted command" };
    }
    return { allowed: true, level: "privileged" };
  }

  // service tokens
  if (command.startsWith("uci.") || command.startsWith("runtime.")) {
    return { allowed: true, level: "service" };
  }

  // guest
  if (command.startsWith("public.")) {
    return { allowed: true, level: "guest" };
  }

  return { allowed: false, level: "blocked", reason: "disallowed command" };
}
