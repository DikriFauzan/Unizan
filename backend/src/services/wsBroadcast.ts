import axios from "axios";
// This helper calls internal WS service (if your backend has WS server)
// or notifies a WS broker. For simplicity it attempts local WS notify HTTP endpoint.
export async function broadcastBuildEvent(jobId: string, payload: any) {
  try {
    await axios.post(process.env.INTERNAL_WS_URL || "http://localhost:8082/notify", { jobId, payload });
  } catch (e: any) {
    console.warn("broadcast failed", e.message);
  }
}
