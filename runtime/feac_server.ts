import * as http from "http";
import { feacRouteWithPolicy } from "./feac_runtime_router";
import { startAgent } from "./feac_agent_manager";
import { startSentinel } from "./feac_sentinel";

const PORT = 3000;

// 1. Start Services
console.log("[SERVER] Booting Sovereign Core...");
startAgent("security"); // Security selalu nyala
startSentinel();        // Sentinel watchdog nyala

// 2. HTTP Interface
const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/v1/uci/execute") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { cmd, payload } = JSON.parse(body);
        console.log(`[SERVER] Incoming: ${cmd}`);
        
        // Execute via Policy Engine
        const result = await feacRouteWithPolicy(cmd, payload || {});
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (e: any) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else if (req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "alive", uptime: process.uptime() }));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`
  ███████╗███████╗ █████╗  ██████╗
  ██╔════╝██╔════╝██╔══██╗██╔════╝
  █████╗  █████╗  ███████║██║     
  ██╔══╝  ██╔══╝  ██╔══██║██║     
  ██║     ███████╗██║  ██║╚██████╗
  ╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝
  --------------------------------
  [BRAIN] Listening on http://localhost:${PORT}
  [SWARM] Agents Active.
  [SEC]   RBAC Policy Active.
  `);
});
