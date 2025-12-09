import React, { useEffect } from "react";

export default function ChatLayout({ children, onBack }) {
  useEffect(() => {
    document.body.classList.add('feac-chat-focused');
    return () => document.body.classList.remove('feac-chat-focused');
  }, []);

  return (
    <div className="chat-layout">
      <div className="chat-header">
        <button onClick={onBack} style={{marginRight:12}}>Back</button>
        <h3>Chat Room</h3>
      </div>
      <div className="chat-main">{children}</div>
    </div>
  );
}
