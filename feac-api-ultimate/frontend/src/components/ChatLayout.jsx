import React from 'react';

export default function ChatLayout({ children }) {
  const [provider, setProvider] = React.useState("Aries Superkey");

  return (
    <div className="chat-layout">
      <div className="top-bar">
        <span>Provider: <b>{provider}</b></span>
      </div>
      <div className="chat-container">
        {children}
      </div>
    </div>
  );
}
