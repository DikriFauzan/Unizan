import * as http from "http";
import { handleRequest } from "./feac_gateway"; // Step 18 Gateway
import { startAgent } from "./feac_agent_manager";
import { startSentinel } from "./feac_sentinel";

const PORT = 3000;

console.log("[SERVER] Booting Sovereign Core + Commerce Gateway...");

// Start Agents
startAgent("security");
startAgent("financial");
startSentinel();

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
  [GATEWAY] http://localhost:${PORT}/v1/store/products
  [GATEWAY] http://localhost:${PORT}/v1/store/buy
  [ADMIN]   http://localhost:${PORT}/v1/uci/execute
  -----------------------------------------------
  Sovereign Commerce Engine: ONLINE
  `);
});
