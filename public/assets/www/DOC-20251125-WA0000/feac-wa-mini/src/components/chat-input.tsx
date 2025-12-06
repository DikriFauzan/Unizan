'use client'

import { useState, useRef } from 'react'
import { Send, Terminal, Code, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface Room {
  id: string
  name: string
  type: string
}

interface ChatInputProps {
  onSendMessage: (content: string, type?: string) => void
  room: Room
}

export function ChatInput({ onSendMessage, room }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isSending) return

    setIsSending(true)
    
    try {
      let messageType = 'text'
      let content = message.trim()

      // Detect command patterns
      if (content.startsWith('/')) {
        messageType = 'command'
      } else if (content.startsWith('!')) {
        messageType = 'event'
        content = content.substring(1)
      }

      await onSendMessage(content, messageType)
      setMessage('')
    } catch (error) {
      toast.error('Gagal mengirim pesan')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const insertCommand = (cmd: string) => {
    setMessage(cmd)
    inputRef.current?.focus()
  }

  const quickCommands = [
    { icon: Terminal, label: 'Build APK', cmd: '/build-apk' },
    { icon: Code, label: 'Fix Code', cmd: '/autofix' },
    { icon: Zap, label: 'Deploy', cmd: '/deploy' },
  ]

  return (
    <div className="chat-input-container">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Pesan untuk ${room.name}...`}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            rows={1}
            disabled={isSending}
          />
          
          <div className="flex space-x-1 mt-2">
            {quickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => insertCommand(cmd.cmd)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <cmd.icon className="h-3 w-3" />
                <span>{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
          className="p-2 bg-whatsapp-green text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}