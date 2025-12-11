import { createProduct, listProducts } from "./feac_products";
import { processPurchase } from "./feac_commerce";

export async function storeRoute(cmd: string, payload: any) {
  switch (cmd) {
    case "store.list":
      return { status: "ok", products: listProducts() };

    case "store.create": // Admin Only
      if (!payload?.id || !payload?.price) return { error: "missing data" };
      return { status: "created", product: createProduct(payload.id, payload.name, payload.price, payload.type, payload.meta) };

    case "store.buy":
      if (!payload?.userId || !payload?.productId) return { error: "missing data" };
      return await processPurchase(payload.userId, payload.productId);

    default: return null;
  }
}
