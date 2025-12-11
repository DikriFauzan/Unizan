import * as http from "http";
import { feacRouteWithPolicy } from "./feac_runtime_router";

// Helper untuk Parsing URL
export async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  
  // CORS Headers (Agar bisa diakses dari Web/Game Engine)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- PUBLIC ENDPOINTS (STORE) ---
  
  // 1. LIST PRODUCTS (GET /v1/store/products)
  if (req.method === "GET" && url.pathname === "/v1/store/products") {
    return executeInternal("store.list", {}, res);
  }

  // 2. BUY ITEM (POST /v1/store/buy)
  if (req.method === "POST" && url.pathname === "/v1/store/buy") {
    return readBodyAndExec("store.buy", req, res);
  }

  // 3. CHECK BALANCE (GET /v1/user/balance?userId=xxx)
  if (req.method === "GET" && url.pathname === "/v1/user/balance") {
    const userId = url.searchParams.get("userId");
    return executeInternal("finance.balance", { userId }, res);
  }

  // --- LEGACY/ADMIN ENDPOINT ---
  if (req.method === "POST" && url.pathname === "/v1/uci/execute") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const { cmd, payload } = JSON.parse(body);
        const result = await feacRouteWithPolicy(cmd, payload || {});
        sendJson(res, result);
      } catch (e: any) { sendError(res, e.message); }
    });
    return;
  }

  // --- HEALTH ---
  if (url.pathname === "/health") {
    sendJson(res, { status: "ok", gateway: "active" });
    return;
  }

  res.writeHead(404);
  res.end("Endpoint Not Found");
}

// Helpers
async function executeInternal(cmd: string, payload: any, res: http.ServerResponse) {
  try {
    const result = await feacRouteWithPolicy(cmd, payload);
    sendJson(res, result);
  } catch (e: any) { sendError(res, e.message); }
}

async function readBodyAndExec(cmd: string, req: http.IncomingMessage, res: http.ServerResponse) {
  let body = "";
  req.on("data", c => body += c);
  req.on("end", async () => {
    try {
      const payload = JSON.parse(body);
      executeInternal(cmd, payload, res);
    } catch (e: any) { sendError(res, e.message); }
  });
}

function sendJson(res: http.ServerResponse, data: any) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sendError(res: http.ServerResponse, msg: string) {
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: msg }));
}
