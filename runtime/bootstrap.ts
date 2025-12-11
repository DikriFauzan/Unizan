console.log("==========================================");
console.log("=      FEAC SOVEREIGN OS - BOOTING       =");
console.log("==========================================");

import "./feac_bus";

// Wake up the Assembly Line
import "./workers/commerce.worker";
import "./workers/retention.worker";
import "./workers/financial.worker"; // FIX: Added Financial Worker

import { startSentinel } from "./feac_sentinel";
startSentinel();

import * as http from "http";
import { handleRequest } from "./feac_gateway";

const PORT = 3000;
const server = http.createServer(handleRequest);
server.listen(PORT, () => {
  console.log("------------------------------------------");
  console.log(`[GATEWAY] World Interface is online on port ${PORT}`);
  console.log("=      SOVEREIGN AI IS FULLY OPERATIONAL     =");
  console.log("==========================================");
});
