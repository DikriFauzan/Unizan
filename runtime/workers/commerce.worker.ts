import { bus } from "../feac_bus";
import { processPurchase } from "../feac_commerce";
import { listProducts, createProduct } from "../feac_products";

console.log("[WORKER] Commerce Assembly Line Ready.");

// Mendengar event dari Bus
bus.on("request:store.buy", async (payload, responseId) => {
  const result = await processPurchase(payload.userId, payload.productId);
  // Kirim hasil kembali ke Bus
  bus.emit(`response:${responseId}`, result);
});

bus.on("request:store.list", (payload, responseId) => {
  const result = { status: "ok", products: listProducts() };
  bus.emit(`response:${responseId}`, result);
});

bus.on("request:store.create", (payload, responseId) => {
  const result = { status: "created", product: createProduct(payload.id, payload.name, payload.price, payload.type, payload.meta) };
  bus.emit(`response:${responseId}`, result);
});
