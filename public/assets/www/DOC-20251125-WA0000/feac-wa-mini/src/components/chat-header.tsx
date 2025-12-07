'use client'

import { User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { trpc } from '@/lib/trpc'
import toast from 'react-hot-toast'

interface ChatHeaderProps {
  user: any
  isConnected: boolean
}

export function ChatHeader({ user, isConnected }: ChatHeaderProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await trpc.auth.logout.mutate()
      logout()
    } catch (error) {
      toast.error('Gagal logout')
    }
  }

  return (
    <div className="chat-header">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <User className="h-8 w-8" />
          <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`} />
        </div>
        <div>
          <h1 className="text-lg font-semibold">{user?.name || 'User'}</h1>
          <p className="text-sm opacity-90">
            {isConnected ? 'Terhubung' : 'Terputus'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <button 
          onClick={handleLogout}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}