type Listener = (msg: string, type: "success" | "error" | "info") => void;

let listeners: Listener[] = [];

export function toast(msg: string, type: "success" | "error" | "info" = "info") {
    listeners.forEach(fn => fn(msg, type));
}

export function onToast(listener: Listener) {
    listeners.push(listener);
}
