import { sendNotification } from "./feac_notifier";
import { submitProposal } from "./feac_proposal";

// Listener ini memantau apa yang terjadi di Cortex (via Polling atau Hook)
// Untuk efisiensi, kita expose fungsi 'broadcastEvent' yang dipanggil manual oleh modul lain

export async function broadcastEvent(topic: string, data: any) {
  // 1. EVENT: CHURN OFFER STARTED (Step 20)
  if (topic === "churn_start") {
    // Beritahu Game Client (Webhook)
    await sendNotification({
      to: `user:${data.userId}`,
      channel: "webhook",
      message: "OFFER_AVAILABLE",
      meta: { type: "retention", userId: data.userId }
    });
    
    // Beritahu Admin (Telegram) - Opsional
    // await sendNotification({
    //   to: "admin",
    //   channel: "telegram",
    //   message: `⚠️ User ${data.userId} is at risk! Retention offer sent.`
    // });
  }

  // 2. EVENT: WINBACK SUCCESS (Step 20)
  if (topic === "winback_success") {
    await sendNotification({
      to: "admin",
      channel: "telegram",
      message: `💰 WINBACK! User ${data.userId} resubscribed to ${data.plan}. Psychology worked!`
    });
  }

  // 3. EVENT: FRAUD DETECTED (Step 17)
  if (topic === "fraud_block") {
    await sendNotification({
      to: "admin",
      channel: "telegram",
      message: `🚨 SECURITY: User ${data.userId} BLOCKED for fraud.`
    });
  }
}
