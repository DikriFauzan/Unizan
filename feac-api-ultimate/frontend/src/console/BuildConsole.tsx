import React, { useEffect, useState } from "react";
import { connectWS, onLog, disconnectWS } from "../ws/wsClient";

export default function BuildConsole() {
    const [buildId, setBuildId] = useState("");
    const [connected, setConnected] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    function startStream() {
        if (!buildId) return;
        setLogs([]);
        connectWS(buildId);
        setConnected(true);
    }

    useEffect(() => {
        onLog((msg) => {
            setLogs(prev => [...prev, msg]);
        });

        return () => {
            disconnectWS();
        };
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Build Console</h2>

            <input
                placeholder="Enter Build ID"
                value={buildId}
                onChange={(e) => setBuildId(e.target.value)}
                style={{ padding: 8, width: 220 }}
            />

            <button
                onClick={startStream}
                style={{ marginLeft: 12, padding: "8px 18px" }}
            >
                Connect
            </button>

            <div
                style={{
                    marginTop: 20,
                    padding: 12,
                    height: "60vh",
                    background: "#111",
                    color: "#0f0",
                    fontFamily: "monospace",
                    overflowY: "scroll",
                    borderRadius: 8
                }}
            >
                {logs.map((l, i) => (
                    <div key={i}>{l}</div>
                ))}
            </div>
        </div>
    );
}
