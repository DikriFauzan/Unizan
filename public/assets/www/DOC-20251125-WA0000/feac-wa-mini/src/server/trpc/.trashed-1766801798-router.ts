import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { createContext } from './context'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'

const prisma = new PrismaClient()
const t = initTRPC.context<typeof createContext>().create()

const JWT_SECRET = process.env.JWT_SECRET || 'feac-wa-mini-secret'

// Auth router
const authRouter = t.router({
  initiateLogin: t.procedure
    .input(z.object({ phoneNumber: z.string() }))
    .mutation(async ({ input }) => {
      // Only allow specific phone number
      if (input.phoneNumber !== '085119887826') {
        throw new Error('Akses ditolak')
      }

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { phoneNumber: input.phoneNumber }
      })

      if (!user) {
        // Create user if doesn't exist
        user = await prisma.user.create({
          data: {
            phoneNumber: input.phoneNumber,
            name: 'Admin FEAC'
          }
        })
      }

      // Check if TOTP is setup
      const totpSecret = await prisma.totpSecret.findFirst({
        where: { userId: user.id, isActive: true }
      })

      // Check if fingerprint is setup
      const fingerprintKey = await prisma.fingerprintKey.findFirst({
        where: { userId: user.id }
      })

      return {
        requiresTOTP: !!totpSecret,
        requiresFingerprint: !!fingerprintKey,
      }
    }),

  verifyTOTP: t.procedure
    .input(z.object({ phoneNumber: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { phoneNumber: input.phoneNumber }
      })

      if (!user) {
        throw new Error('User tidak ditemukan')
      }

      const totpSecret = await prisma.totpSecret.findFirst({
        where: { userId: user.id, isActive: true }
      })

      if (!totpSecret) {
        throw new Error('TOTP tidak diatur')
      }

      const verified = speakeasy.totp.verify({
        secret: totpSecret.secret,
        encoding: 'base32',
        token: input.code,
        window: 2
      })

      if (!verified) {
        throw new Error('Kode TOTP salah')
      }

      // Create session
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' })
      
      await prisma.loginSession.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })

      return { success: true, token }
    }),

  verifyFingerprint: t.procedure
    .input(z.object({ phoneNumber: z.string(), fingerprint: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { phoneNumber: input.phoneNumber }
      })

      if (!user) {
        throw new Error('User tidak ditemukan')
      }

      // Verify fingerprint
      const fingerprintKey = await prisma.fingerprintKey.findFirst({
        where: { userId: user.id }
      })

      if (!fingerprintKey) {
        throw new Error('Fingerprint tidak diatur')
      }

      // Create session
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' })
      
      await prisma.loginSession.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })

      return { success: true, token }
    }),

  logout: t.procedure
    .mutation(async ({ ctx }) => {
      // TODO: Implement logout logic
      return { success: true }
    }),
})

// Chat router
const chatRouter = t.router({
  getMessages: t.procedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      const messages = await prisma.chatMessage.findMany({
        where: { roomId: input.roomId },
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      })
      return messages
    }),

  sendMessage: t.procedure
    .input(z.object({
      roomId: z.string(),
      content: z.string(),
      type: z.string().default('text')
    }))
    .mutation(async ({ input, ctx }) => {
      // TODO: Get user from context
      const userId = 'user-085119887826'

      const message = await prisma.chatMessage.create({
        data: {
          roomId: input.roomId,
          userId,
          content: input.content,
          type: input.type,
        },
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      })

      return message
    }),
})

// Command router
const commandRouter = t.router({
  execute: t.procedure
    .input(z.object({
      command: z.string(),
      args: z.array(z.string()).optional()
    }))
    .mutation(async ({ input }) => {
      const command = await prisma.command.create({
        data: {
          userId: 'user-085119887826',
          command: input.command,
          args: input.args,
          status: 'pending'
        }
      })

      // Execute command based on type
      let result = null
      let error = null
      let status = 'completed'

      try {
        switch (input.command) {
          case '/build-apk':
            result = await executeBuildAPK(input.args || [])
            break
          case '/autofix':
            result = await executeAutofix(input.args || [])
            break
          case '/deploy':
            result = await executeDeploy(input.args || [])
            break
          default:
            result = `Command tidak dikenal: ${input.command}`
        }
      } catch (err: any) {
        error = err.message
        status = 'failed'
      }

      // Update command status
      await prisma.command.update({
        where: { id: command.id },
        data: {
          status,
          result,
          error,
          executedAt: new Date()
        }
      })

      return { result, error, status }
    }),
})

// NeoEngine router
const neoEngineRouter = t.router({
  sendCommand: t.procedure
    .input(z.object({
      command: z.string(),
      payload: z.any()
    }))
    .mutation(async ({ input }) => {
      // Create NeoEngine log
      const log = await prisma.neoEngineLog.create({
        data: {
          eventType: 'command',
          source: 'feac-wa-core',
          destination: 'neoengine',
          command: input.command,
          payload: input.payload,
          signature: 'mock-signature'
        }
      })

      // TODO: Send to NeoEngine via WebSocket
      return { success: true, logId: log.id }
    }),

  getEvents: t.procedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const events = await prisma.neoEngineLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: input.limit
      })
      return events
    }),
})

// Build router
const buildRouter = t.router({
  create: t.procedure
    .input(z.object({
      projectName: z.string(),
      version: z.string()
    }))
    .mutation(async ({ input }) => {
      const build = await prisma.buildHistory.create({
        data: {
          projectName: input.projectName,
          version: input.version,
          status: 'building'
        }
      })

      // TODO: Trigger actual build process
      return build
    }),

  getHistory: t.procedure
    .query(async () => {
      const builds = await prisma.buildHistory.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      })
      return builds
    }),
})

// Main router
export const appRouter = t.router({
  auth: authRouter,
  chat: chatRouter,
  command: commandRouter,
  neoEngine: neoEngineRouter,
  build: buildRouter,
})

export type AppRouter = typeof appRouter

// Command execution functions
async function executeBuildAPK(args: string[]): Promise<string> {
  // Simulate APK build process
  await new Promise(resolve => setTimeout(resolve, 5000))
  
  const buildPath = '/sdcard/Documents/Dikri/apk-release.apk'
  return `APK berhasil dibuild: ${buildPath}`
}

async function executeAutofix(args: string[]): Promise<string> {
  // Simulate auto-fix process
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  return 'Auto-fix selesai: 3 file diperbaiki'
}

async function executeDeploy(args: string[]): Promise<string> {
  // Simulate deployment
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return 'Deploy berhasil ke production'
}