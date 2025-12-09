const WebSocket = require("ws");
const axios = require("axios");

const WS_URL = process.env.BUILDER_WS || "ws://localhost:7001";
const API_URL = process.env.BACKEND_URL || "http://localhost:8000/v1";

exports.emitLog = async (buildId, message) => {
    try {
        const ws = new WebSocket(`${WS_URL}/ws/${buildId}`);
        ws.on("open", () => ws.send(message));
    } catch (e) {}

    try {
        await axios.post(`${API_URL}/internal/build/log`, {
            buildId,
            message
        });
    } catch (e) {}
};
