import { verifyMemory, listGuard } from "./feac_memory_guard";
import { revokeKey } from "./feac_key_revoke";
import { writeRotationLog } from "./feac_rotation_audit";

export function scanAllMemory(): any[] {
  const list = listGuard();
  const result: any[] = [];

  for (const rec of list) {
    const s = verifyMemory(rec.file);
    result.push({ file: rec.file, ...s });

    if (!s.ok) {
      revokeKey("owner", { reason: "memory-corruption-detected" });

      writeRotationLog({
        id: "memory-corruption-" + Date.now(),
        timestamp: Date.now(),
        oldKeyMasked: "???",
        newKeyMasked: "revoked",
        reason: "memory-corruption"
      });
    }
  }
  return result;
}
