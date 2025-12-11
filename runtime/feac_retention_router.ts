import { getBenefit } from "./feac_benefits";
import { triggerWinBack } from "./feac_retention";

export async function retentionRoute(cmd: string, payload: any) {
  switch (cmd) {
    case "user.benefit": // Cek multiplier iklan saat ini
      if (!payload?.userId) return { error: "missing userId" };
      return { status: "ok", benefit: getBenefit(payload.userId) };

    case "sub.resubscribe_event": // Webhook saat user beli lagi
      if (!payload?.userId || !payload?.plan) return { error: "missing data" };
      return triggerWinBack(payload.userId, payload.plan);

    default: return null;
  }
}
