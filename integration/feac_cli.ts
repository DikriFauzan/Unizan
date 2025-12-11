// Client sederhana untuk bicara ke Server Local
// Usage: ts-node feac_cli.ts <cmd> [json_payload]

async function callServer(cmd: string, payload: any = {}) {
  try {
    const response = await fetch("http://localhost:3000/v1/uci/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        cmd, 
        payload: { ...payload, token: "admin-super-token" } // Simulasi Token Admin
      })
    });
    return await response.json();
  } catch (e) {
    return { error: "Server is offline. Run 'npm run start' first." };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (!action) {
    console.log(`
    FEAC SOVEREIGN CLI
    ------------------
    status              -> Cek kesehatan & agen
    agents              -> List status agen
    proposals           -> Lihat proposal tertunda
    approve <id>        -> Setujui proposal
    reject <id>         -> Tolak proposal
    scan                -> Trigger memory scan manual
    shutdown            -> Matikan agen tertentu (usage: shutdown agent_name)
    `);
    return;
  }

  let res;
  switch (action) {
    case "status":
      res = await callServer("runtime.health");
      break;
    case "agents":
      res = await callServer("agent.list");
      break;
    case "proposals":
      res = await callServer("proposal.list", { status: "pending" });
      break;
    case "approve":
      if (!args[1]) { console.log("Usage: approve <id>"); return; }
      res = await callServer("proposal.approve", { id: args[1] });
      break;
    case "reject":
      if (!args[1]) { console.log("Usage: reject <id>"); return; }
      res = await callServer("proposal.reject", { id: args[1] });
      break;
    case "scan":
      res = await callServer("admin.memory.scan");
      break;
    case "shutdown":
      if (!args[1]) { console.log("Usage: shutdown <agent_name>"); return; }
      res = await callServer("agent.stop", { name: args[1] });
      break;
    default:
      console.log("Unknown command. Passing raw to router...");
      try {
        const payload = args[1] ? JSON.parse(args[1]) : {};
        res = await callServer(action, payload);
      } catch {
        console.log("Invalid JSON payload");
        return;
      }
  }

  console.log(JSON.stringify(res, null, 2));
}

main();
