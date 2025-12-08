let socket: WebSocket | null = null;
let listeners: ((msg: string) => void)[] = [];

export function connectWS(buildId: string) {
    if (socket) return;
    const url = `wss://feac-build-agent.example/ws/${buildId}`;
    socket = new WebSocket(url);

    socket.onmessage = (ev) => {
        listeners.forEach(fn => fn(ev.data));
    };

    socket.onclose = () => {
        socket = null;
    };
}

export function onLog(callback: (msg: string) => void) {
    listeners.push(callback);
}

export function disconnectWS() {
    if (socket) socket.close();
    socket = null;
}
