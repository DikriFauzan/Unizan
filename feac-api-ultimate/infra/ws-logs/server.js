/**
 * Simple WebSocket log bridge
 * - subscribes to Redis channel "feac:build:logs"
 * - exposes ws endpoint: ws://<host>:8081/?buildId=...
 * - forwards messages that match buildId or broadcast if no buildId provided
 */
const WebSocket = require('ws');
const IORedis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const sub = new IORedis(redisUrl);

const port = process.env.WS_PORT || 8081;
const wss = new WebSocket.Server({ port });

console.log(`[WS-LOG] Listening on port ${port}`);

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://localhost`);
  const buildId = url.searchParams.get('buildId');
  ws.buildId = buildId || null;

  ws.send(JSON.stringify({ system: 'connected', buildId: ws.buildId || 'all' }));
});

sub.subscribe('feac:build:logs', (err, count) => {
  if (err) console.error(err);
});

sub.on('message', (channel, message) => {
  try {
    const data = JSON.parse(message);
    // broadcast to matching clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (!client.buildId || client.buildId === data.jobId) {
          client.send(JSON.stringify(data));
        }
      }
    });
  } catch (e) {
    console.error("Invalid log payload", e);
  }
});
