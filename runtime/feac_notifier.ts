import * as https from "https";
import { learn } from "./feac_cortex";

export interface Notification {
  to: string;     // "admin", "user:123", "broadcast"
  channel: "telegram" | "webhook" | "log";
  message: string;
  meta?: any;
}

// Simulasi Config (Nanti Anda isi Token Asli)
const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN"; 
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID";

export async function sendNotification(note: Notification) {
  console.log(`[NOTIFIER] Sending to ${note.to} via ${note.channel}: ${note.message}`);

  // Catat ke Cortex (History)
  learn("notification_sent", note, ["communication"]);

  try {
    if (note.channel === "telegram") {
      // Mockup Send Telegram (Uncomment to use real API)
      // await sendTelegram(note.message);
      return { status: "sent", via: "telegram" };
    }
    
    if (note.channel === "webhook") {
      // Kirim ke Game Client (Simulasi)
      return { status: "sent", via: "webhook" };
    }
    
    return { status: "logged" };
  } catch (e: any) {
    console.error("[NOTIFIER] Failed:", e.message);
    return { status: "error", error: e.message };
  }
}

// Real Telegram Sender Implementation
async function sendTelegram(text: string) {
  if (TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN") return; // Skip if not configured
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const data = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text });

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      res.on("data", () => {});
      res.on("end", () => resolve(true));
    });
    req.on("error", (e) => reject(e));
    req.write(data);
    req.end();
  });
}
