import { FEACRuntimeBinding } from "./feac_runtime_binding";

/**
 * Router untuk FEAC Runtime.
 * Ini adalah entrypoint universal untuk:
 *  - FEAC Engine
 *  - Sovereign Admin
 *  - SuperKey Integration
 *  - Automation Layer
 */
const binding = new FEACRuntimeBinding();

export async function feacRoute(command: string, payload: any) {
  switch (command) {
    case "superkey.exec":
    case "superkey.validate":
    case "superkey.meta":
      return await binding.send(command, payload);

    case "runtime.health":
      return { status: "ok", time: Date.now() };

    case "runtime.echo":
      return { status: "ok", echo: payload };

    default:
      return {
        status: "error",
        error: "Unknown command at router"
      };
  }
}

// ================== AUTO-POLICY INJECT (STEP 8) ==================
import { evaluateToken } from "./feac_token_policy";
import { writeAudit } from "./feac_audit";

export async function feacRouteWithPolicy(cmd: string, payload: any) {
  const token = payload?.token || "";
  const policy = evaluateToken(token, cmd);

  writeAudit(cmd, token, policy.level, policy.allowed, policy.reason);

  if (!policy.allowed) {
    return {
      status: "denied",
      reason: policy.reason || "policy-blocked",
      level: policy.level
    };
  }

  // forward to normal router
  // feacRoute already exists above in original file
  // @ts-ignore
  return await feacRoute(cmd, payload);
}
