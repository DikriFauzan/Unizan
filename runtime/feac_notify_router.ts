import { sendNotification } from "./feac_notifier";
import { broadcastEvent } from "./feac_event_listener";

export async function notifyRoute(cmd: string, payload: any) {
  switch (cmd) {
    case "notify.send": // Manual send (Admin)
      if (!payload?.message) return { error: "missing message" };
      return await sendNotification({
        to: payload.to || "admin",
        channel: payload.channel || "log",
        message: payload.message
      });

    case "event.trigger": // Internal trigger
      if (!payload?.topic) return { error: "missing topic" };
      await broadcastEvent(payload.topic, payload.data || {});
      return { status: "triggered" };

    default: return null;
  }
}
