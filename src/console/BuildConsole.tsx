import React, { useEffect, useState } from "react";
import { connectWS, onLog, disconnectWS } from "../ws/wsClient";

export default function BuildConsole() {
    const [buildId, setBuildId] = useState("");
    const [logs, setLogs] = useState<string[]>([]);

    function startStream() {
        if (!buildId) return;
        setLogs([]);
        connectWS(buildId);
    }

    useEffect(() => {
        onLog((msg) => {
            setLogs(prev => [...prev, msg]);
        });

        return () => disconnectWS();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Build Console</h2>

            <input
                placeholder="Build ID"
                value={buildId}
                onChange={(e) => setBuildId(e.target.value)}
                style={{ padding: 8, width: 240 }}
            />

            <button onClick={startStream} style={{ marginLeft: 10, padding: "8px 16px" }}>
                Connect
            </button>

            <div style={{
                marginTop: 20,
                padding: 12,
                height: "60vh",
                background: "#111",
                color: "#0f0",
                fontFamily: "monospace",
                overflowY: "scroll",
                borderRadius: 8
            }}>
                {logs.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))}
            </div>
        </div>
    );
}
