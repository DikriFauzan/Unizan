'use client'

import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { FileText, Terminal, AlertCircle, CheckCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  type: string
  createdAt: Date
  user?: {
    id: string
    name?: string
  }
}

interface Room {
  id: string
  name: string
  type: string
}

interface ChatMessagesProps {
  messages: Message[]
  currentUser: any
  room: Room
}

export function ChatMessages({ messages, currentUser, room }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'command':
        return <Terminal className="h-4 w-4 inline mr-2" />
      case 'event':
        return <FileText className="h-4 w-4 inline mr-2" />
      case 'error':
        return <AlertCircle className="h-4 w-4 inline mr-2 text-red-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 inline mr-2 text-green-500" />
      default:
        return null
    }
  }

  const getMessageClass = (type: string) => {
    switch (type) {
      case 'command':
        return 'bg-blue-100 border-blue-200'
      case 'event':
        return 'bg-purple-100 border-purple-200'
      case 'error':
        return 'bg-red-100 border-red-200'
      case 'success':
        return 'bg-green-100 border-green-200'
      default:
        return ''
    }
  }

  return (
    <div className="chat-messages">
      {messages.map((message) => {
        const isSent = message.user?.id === currentUser?.id
        
        return (
          <div
            key={message.id}
            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`message-bubble ${
                isSent ? 'message-sent' : 'message-received'
              } ${getMessageClass(message.type)}`}
            >
              <div className="flex items-start space-x-2">
                {getMessageIcon(message.type)}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(new Date(message.createdAt), 'HH:mm', { locale: id })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}