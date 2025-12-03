'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ChatHeader } from '@/components/chat-header'
import { ChatMessages } from '@/components/chat-messages'
import { ChatInput } from '@/components/chat-input'
import { RoomSelector } from '@/components/room-selector'
import { useWebSocket } from '@/lib/websocket'
import { trpc } from '@/lib/trpc'

const ROOMS = [
  { id: 'termux-bridge', name: 'Termux Bridge', type: 'termux-bridge' as const },
  { id: 'neoengine', name: 'NeoEngine', type: 'neoengine' as const },
  { id: 'admin', name: 'Admin', type: 'admin' as const },
]

export default function ChatPage() {
  const { user } = useAuth()
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0])
  const [messages, setMessages] = useState<any[]>([])
  const { isConnected, sendMessage } = useWebSocket()

  // Load messages for current room
  const { data: roomMessages, refetch } = trpc.chat.getMessages.useQuery({
    roomId: selectedRoom.id,
  })

  useEffect(() => {
    if (roomMessages) {
      setMessages(roomMessages)
    }
  }, [roomMessages])

  const handleSendMessage = async (content: string, type: string = 'text') => {
    if (!user) return

    try {
      // Send via tRPC
      await trpc.chat.sendMessage.mutate({
        roomId: selectedRoom.id,
        content,
        type,
      })

      // Send via WebSocket for real-time
      sendMessage({
        type: 'chat_message',
        roomId: selectedRoom.id,
        content,
        messageType: type,
      })

      // Refresh messages
      refetch()
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="chat-container">
      <ChatHeader 
        user={user} 
        isConnected={isConnected}
      />
      
      <div className="p-4">
        <RoomSelector
          rooms={ROOMS}
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
        />
      </div>

      <ChatMessages
        messages={messages}
        currentUser={user}
        room={selectedRoom}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        room={selectedRoom}
      />
    </div>
  )
}