import * as fs from "fs";
import * as path from "path";

const PROD_PATH = path.join(process.env.HOME || ".", "feac_products_db.json");

export interface Product {
  id: string;
  name: string;
  price: number;
  type: "API_KEY" | "GAME_ITEM" | "SUBSCRIPTION";
  metadata: any; // Misal: { damage: 50 } untuk item game
}

function loadDB(): Product[] {
  if (!fs.existsSync(PROD_PATH)) return [];
  try { return JSON.parse(fs.readFileSync(PROD_PATH, "utf8")); } catch { return []; }
}

function saveDB(data: Product[]) {
  fs.writeFileSync(PROD_PATH, JSON.stringify(data, null, 2));
}

export function createProduct(id: string, name: string, price: number, type: any, meta: any = {}) {
  const db = loadDB();
  const prod: Product = { id, name, price, type, metadata: meta };
  
  // Update or Insert
  const idx = db.findIndex(p => p.id === id);
  if (idx >= 0) db[idx] = prod;
  else db.push(prod);
  
  saveDB(db);
  return prod;
}

export function listProducts() {
  return loadDB();
}

export function getProduct(id: string) {
  return loadDB().find(p => p.id === id);
}
