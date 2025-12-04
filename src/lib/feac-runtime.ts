let ws: WebSocket | null = null;

export function connectFEAC() {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  // Local Termux Bridge Port
  ws = new WebSocket("ws://127.0.0.1:9001");

  ws.onopen = () => console.log("✅ FEAC Runtime Connected");
  ws.onclose = () => setTimeout(connectFEAC, 1000);
  ws.onerror = () => console.log("⚠️ FEAC Runtime Disconnected");
  ws.onmessage = (msg) => {
    console.log("FEAC INSTRUCTION:", msg.data);
  };
}
