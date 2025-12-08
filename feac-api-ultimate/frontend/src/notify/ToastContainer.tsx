import React, { useEffect, useState } from "react";
import { onToast } from "./ToastBus";

interface ToastMessage {
    id: number;
    text: string;
    type: "success" | "error" | "info";
}

export default function ToastContainer() {
    const [messages, setMessages] = useState<ToastMessage[]>([]);

    useEffect(() => {
        onToast((msg, type) => {
            const id = Date.now();
            setMessages(prev => [...prev, { id, text: msg, type }]);
            setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== id));
            }, 4000);
        });
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            {messages.map(m => (
                <div
                    key={m.id}
                    style={{
                        padding: "12px 18px",
                        borderRadius: 8,
                        background:
                            m.type === "success" ? "#0a0" :
                            m.type === "error" ? "#a00" : "#333",
                        color: "#fff",
                        fontSize: 14,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                    }}
                >
                    {m.text}
                </div>
            ))}
        </div>
    );
}
