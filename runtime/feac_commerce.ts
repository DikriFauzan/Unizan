import { getProduct } from "./feac_products";
import { getBalance, recordTransaction } from "./feac_ledger";
import { submitProposal } from "./feac_proposal";
import { learn } from "./feac_cortex";

// Fungsi Pembelian Otomatis
export async function processPurchase(userId: string, productId: string) {
  // 1. Cek Produk
  const product = getProduct(productId);
  if (!product) return { status: "error", error: "product-not-found" };

  // 2. Cek Saldo User
  const balance = getBalance(userId);
  if (balance < product.price) {
    return { status: "failed", error: "insufficient-funds", currentBalance: balance, required: product.price };
  }

  // 3. Eksekusi Transaksi (Potong Saldo)
  recordTransaction("PURCHASE", product.price, userId, `Bought ${product.name}`);

  // 4. DELIVERY (Kirim Barang)
  let deliveryResult: any = {};
  
  if (product.type === "API_KEY") {
    // Simulasi Generate Key (Nanti bisa dihubungkan ke Key Manager Step 7)
    const newKey = "sk-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2);
    deliveryResult = { apiKey: newKey, tier: product.metadata.tier || "standard" };
    
    // Auto-Learn: Catat penjualan ke Cortex
    learn("sales_log", { productId, price: product.price, user: userId }, ["revenue", "api_sales"]);
  } 
  else if (product.type === "GAME_ITEM") {
    deliveryResult = { itemId: productId, stats: product.metadata };
    learn("sales_log", { productId, price: product.price, user: userId }, ["revenue", "game_sales"]);
  }

  // 5. High Value Alert (Untuk Revenue Agent)
  if (product.price > 1000) {
    submitProposal("marketing.thank_you", { userId }, "High value customer purchase > $1000");
  }

  return { status: "success", product: product.name, delivery: deliveryResult, remainingBalance: getBalance(userId) };
}
