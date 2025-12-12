let socket: WebSocket | null = null;
let listeners: ((msg: string) => void)[] = [];

export function connectWS(buildId: string) {
    if (socket) return;
    // Use same origin if served from browser; otherwise fallback to http://localhost:8000
    const loc = (typeof window !== "undefined" && window.location) ? window.location : null;
    const host = loc ? loc.host : "localhost:8000";
    const protocol = (loc && loc.protocol === "https:") ? "wss" : "ws";
    const url = `${protocol}://${host}/ws/build/${buildId}`;
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
