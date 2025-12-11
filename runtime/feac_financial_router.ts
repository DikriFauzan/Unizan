import { recordTransaction, getBalance, getRecentTransactions } from "./feac_ledger";

export async function financialRoute(cmd: string, payload: any) {
  switch (cmd) {
    case "finance.deposit":
      if (!payload?.userId || !payload?.amount) return { error: "missing data" };
      return recordTransaction("DEPOSIT", payload.amount, payload.userId, "Topup Balance");

    case "finance.purchase":
      if (!payload?.userId || !payload?.amount) return { error: "missing data" };
      // Cek saldo dulu
      const bal = getBalance(payload.userId);
      if (bal < payload.amount) return { status: "failed", error: "insufficient-balance" };
      
      return recordTransaction("PURCHASE", payload.amount, payload.userId, payload.item || "API Key Purchase");

    case "finance.balance":
      if (!payload?.userId) return { error: "missing userId" };
      return { status: "ok", userId: payload.userId, balance: getBalance(payload.userId) };

    case "finance.audit":
      return { status: "ok", log: getRecentTransactions() };

    default: return null;
  }
}
