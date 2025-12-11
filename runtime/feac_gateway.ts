import * as http from "http";
import * as crypto from "crypto";
import { bus } from "./feac_bus";

export async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // Resepsionis hanya butuh 2 hal: nama tamu & apa maunya
  let cmd: string | null = null;
  let body: any = {};

  // Rute sederhana
  if (req.method === "GET" && url.pathname === "/v1/store/products") cmd = "store.list";
  if (req.method === "GET" && url.pathname.startsWith("/v1/user/benefit")) {
    cmd = "user.benefit";
    body = { userId: url.searchParams.get("userId") };
  }
  if (req.method === "POST" && url.pathname === "/v1/store/buy") cmd = "store.buy";
  
  // Jika cmd butuh body dari POST
  if (req.method === "POST" && Object.keys(body).length === 0) {
    let rawBody = "";
    req.on("data", c => rawBody += c);
    req.on("end", () => {
      try {
        body = JSON.parse(rawBody);
        dispatchToBus(cmd!, body, res);
      } catch (e) { sendError(res, "Invalid JSON"); }
    });
  } else if (cmd) {
    dispatchToBus(cmd, body, res);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

// Teriak ke Bus dan tunggu jawaban
function dispatchToBus(cmd: string, payload: any, res: http.ServerResponse) {
  const responseId = crypto.randomUUID();

  // Menunggu jawaban dari worker
  bus.once(`response:${responseId}`, (result) => {
    sendJson(res, result);
  });
  
  // Teriak ke Bus
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
