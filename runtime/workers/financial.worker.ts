import { bus } from "../feac_bus";
import { recordTransaction, getBalance } from "../feac_ledger";

console.log("[WORKER] Financial/Ledger System Ready.");

bus.on("request:finance.deposit", (payload, responseId) => {
  if (!payload?.userId || !payload?.amount) {
     bus.emit(`response:${responseId}`, { error: "missing data" });
     return;
  }
  const res = recordTransaction("DEPOSIT", payload.amount, payload.userId, "Topup Balance");
  bus.emit(`response:${responseId}`, res);
});

bus.on("request:finance.balance", (payload, responseId) => {
  if (!payload?.userId) {
     bus.emit(`response:${responseId}`, { error: "missing userId" });
     return;
  }
  const bal = getBalance(payload.userId);
  bus.emit(`response:${responseId}`, { status: "ok", userId: payload.userId, balance: bal });
});
