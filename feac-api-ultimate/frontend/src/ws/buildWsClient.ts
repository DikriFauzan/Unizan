let socket: WebSocket|null = null;
let listeners: Array<(ev:any)=>void> = [];

export function connectBuildWS(jobId: string) {
  if (socket) return;
  const url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + `/ws/build/${jobId}`;
  socket = new WebSocket(url);
  socket.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    listeners.forEach(fn => fn(data));
  };
  socket.onclose = () => { socket = null; listeners = []; };
}
export function onBuildEvent(fn:(ev:any)=>void) { listeners.push(fn); }
export function disconnectBuildWS() { if (socket) socket.close(); socket = null; listeners = []; }
