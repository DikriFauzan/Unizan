import { Server as IOServer } from "socket.io";
let io: IOServer | null = null;

export function attachSocket(server: any) {
  if (io: any) return io;
  io = new IOServer(server, { cors: { origin: "*" } });
  io.on("connection", (socket: any) => {
    console.log("[WS] client connected", socket.id);
    socket.on("subscribeBuild", (buildId: string) => {
      if (buildId) socket.join(`build:${buildId}`);
    });
    socket.on("unsubscribeBuild", (buildId: string) => {
      if (buildId) socket.leave(`build:${buildId}`);
    });
  });
  return io;
}

export function emitBuildEvent(buildId: string, payload: any) {
  if (!io) {
    console.warn("[WS] emit attempted but io not initialized");
    return;
  }
  io.to(`build:${buildId}`).emit("build:update", payload);
  // Broadcast to a general room if needed
  io.emit("build:global", payload);
}
