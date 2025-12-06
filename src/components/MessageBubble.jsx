import React from 'react';
import { CheckCheck, Terminal, Globe, Video, Image as ImageIcon, Lock, Code } from 'lucide-react';

export const MessageBubble = ({ message, isMe }) => {
  if (message.type === 'alert') {
      return <div className="flex justify-center my-2"><span className="bg-[#1f2c33] text-yellow-400 text-xs px-2 py-1 rounded font-mono">{message.content}</span></div>;
  }
  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div className={`max-w-[85%] rounded-lg p-2 shadow-sm relative ${isMe ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}`}>
        {!isMe && <div className="text-xs font-bold mb-1 text-purple-400">~{message.senderId}</div>}
        <div className="text-sm whitespace-pre-wrap">
            {message.type === 'code' ? <div className="bg-black p-2 rounded font-mono text-xs text-green-400 overflow-x-auto">{message.content}</div> : message.content}
        </div>
        <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-400">
          <span>{new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
          {isMe && <CheckCheck size={12} className="text-blue-400" />}
        </div>
      </div>
    </div>
  );
};
