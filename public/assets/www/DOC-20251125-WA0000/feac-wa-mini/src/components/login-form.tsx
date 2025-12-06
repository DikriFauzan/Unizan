'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Lock, Key, Fingerprint } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { trpc } from '@/lib/trpc'
import toast from 'react-hot-toast'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('085119887826')
  const [step, setStep] = useState<'phone' | 'fingerprint' | 'totp'>('phone')
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate phone number (only allow 085119887826)
      if (phoneNumber !== '085119887826') {
        throw new Error('Akses hanya untuk nomor 085119887826')
      }

      const result = await trpc.auth.initiateLogin.mutate({ phoneNumber })
      
      if (result.requiresFingerprint) {
        setStep('fingerprint')
      } else if (result.requiresTOTP) {
        setStep('totp')
      } else {
        // Auto login for authorized user
        await login(phoneNumber)
        router.push('/chat')
      }
    } catch (error: any) {
      toast.error(error.message || 'Login gagal')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFingerprint = async () => {
    setIsLoading(true)
    
    try {
      // Simulate fingerprint authentication
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = await trpc.auth.verifyFingerprint.mutate({
        phoneNumber,
        fingerprint: 'mock-fingerprint-' + Date.now(),
      })
      
      if (result.success) {
        await login(phoneNumber)
        router.push('/chat')
      }
    } catch (error: any) {
      toast.error(error.message || 'Fingerprint gagal')
      setStep('totp')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTOTP = async (code: string) => {
    setIsLoading(true)
    
    try {
      const result = await trpc.auth.verifyTOTP.mutate({
        phoneNumber,
        code,
      })
      
      if (result.success) {
        await login(phoneNumber)
        router.push('/chat')
      }
    } catch (error: any) {
      toast.error(error.message || 'Kode TOTP salah')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'fingerprint') {
    return (
      <div className="text-center">
        <Fingerprint className="h-16 w-16 mx-auto mb-4 text-whatsapp-green" />
        <h2 className="text-xl font-semibold mb-4">Verifikasi Sidik Jari</h2>
        <p className="text-gray-600 mb-6">Tempelkan sidik jari Anda untuk melanjutkan</p>
        <button
          onClick={handleFingerprint}
          disabled={isLoading}
          className="w-full bg-whatsapp-green text-white py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Memproses...' : 'Verifikasi Sidik Jari'}
        </button>
      </div>
    )
  }

  if (step === 'totp') {
    return (
      <div>
        <div className="text-center mb-6">
          <Key className="h-12 w-12 mx-auto mb-2 text-whatsapp-green" />
          <h2 className="text-xl font-semibold">Verifikasi 2FA</h2>
        </div>
        <TOTPForm onSubmit={handleTOTP} isLoading={isLoading} />
      </div>
    )
  }

  return (
    <form onSubmit={handlePhoneSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nomor Telepon
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
            placeholder="085119887826"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Akses hanya untuk nomor 085119887826
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || phoneNumber !== '085119887826'}
        className="w-full bg-whatsapp-green text-white py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Memproses...' : 'Lanjutkan'}
      </button>
    </form>
  )
}

function TOTPForm({ onSubmit, isLoading }: { onSubmit: (code: string) => void, isLoading: boolean }) {
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      onSubmit(code)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kode 6 Digit
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent text-center text-2xl tracking-widest"
          placeholder="000000"
          maxLength={6}
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full bg-whatsapp-green text-white py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
      </button>
    </form>
  )
}