import * as http from "http";
import * as crypto from "crypto";
import { bus } from "./feac_bus";

export async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  let cmd: string | null = null;
  let urlParams: any = {};

  // --- ROUTING MAP ---
  if (url.pathname === "/v1/store/products") cmd = "store.list";
  else if (url.pathname === "/v1/store/buy") cmd = "store.buy";
  else if (url.pathname === "/v1/store/create") cmd = "store.create"; // FIX: Added Route
  else if (url.pathname === "/v1/user/benefit") {
    cmd = "user.benefit";
    urlParams = { userId: url.searchParams.get("userId") };
  } 
  else if (url.pathname === "/v1/user/balance") {
    cmd = "finance.balance"; // FIX: Added Route
    urlParams = { userId: url.searchParams.get("userId") };
  }

  // --- SPECIAL CASE: UNIVERSAL COMMAND INTERFACE (UCI) ---
  // Endpoint ini membaca 'cmd' dari dalam body JSON
  if (req.method === "POST" && url.pathname === "/v1/uci/execute") {
    readBody(req, res, (payload) => {
      if (!payload.cmd) { sendError(res, "Missing 'cmd' in body"); return; }
      dispatchToBus(payload.cmd, payload.payload || {}, res);
    });
    return;
  }

  // --- STANDARD DISPATCH ---
  if (cmd) {
    if (req.method === "POST") {
      readBody(req, res, (body) => {
        dispatchToBus(cmd!, { ...urlParams, ...body }, res);
      });
    } else {
      dispatchToBus(cmd, urlParams, res);
    }
  } else {
    res.writeHead(404);
    res.end("Endpoint Not Found");
  }
}

// Helpers
function readBody(req: http.IncomingMessage, res: http.ServerResponse, cb: (json: any) => void) {
  let body = "";
  req.on("data", c => body += c);
  req.on("end", () => {
    try {
      const json = body ? JSON.parse(body) : {};
      cb(json);
    } catch (e) { sendError(res, "Invalid JSON body"); }
  });
}

function dispatchToBus(cmd: string, payload: any, res: http.ServerResponse) {
  const responseId = crypto.randomUUID();
  
  // Timeout Guard (Agar tidak stuck selamanya jika worker mati)
  const timeout = setTimeout(() => {
    bus.removeAllListeners(`response:${responseId}`);
    sendError(res, `Gateway Timeout: No worker replied to ${cmd}`);
  }, 5000);

  bus.once(`response:${responseId}`, (result) => {
    clearTimeout(timeout);
    sendJson(res, result);
  });
  
  bus.emit(`request:${cmd}`, payload, responseId);
}

function sendJson(res: http.ServerResponse, data: any) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
function sendError(res: http.ServerResponse, msg: string) {
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: msg }));
}
