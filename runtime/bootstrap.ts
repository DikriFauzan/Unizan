// The file that wakes up the entire AI consciousness

console.log("==========================================");
console.log("=      FEAC SOVEREIGN OS - BOOTING       =");
console.log("==========================================");

// 1. Initialize The Neural Bus
import "./feac_bus";

// 2. Wake up the Assembly Line (Workers)
import "./workers/commerce.worker";
import "./workers/retention.worker";
// Nanti kita bisa tambah:
// import "./workers/security.worker";
// import "./workers/analytic.worker";

// 3. Start The Heartbeat (Sentinel)
import { startSentinel } from "./feac_sentinel";
startSentinel();

// 4. Open The Gateway to the World
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
