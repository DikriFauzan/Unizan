import { Server } from 'ws'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface WebSocketMessage {
  type: string
  [key: string]: any
}

export function createWebSocketServer(server: any) {
  const wss = new Server({ server })

  wss.on('connection', (ws, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`)
    const userId = url.searchParams.get('userId')

    if (!userId || userId !== 'user-085119887826') {
      ws.close(1008, 'Unauthorized')
      return
    }

    console.log(`WebSocket connected for user: ${userId}`)

    ws.on('message', async (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString())
        
        switch (message.type) {
          case 'chat_message':
            await handleChatMessage(message, userId)
            break
          case 'command':
            await handleCommand(message, userId)
            break
          case 'build_request':
            await handleBuildRequest(message, userId)
            break
          default:
            console.log('Unknown message type:', message.type)
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    })

    ws.on('close', () => {
      console.log(`WebSocket disconnected for user: ${userId}`)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to FEAC WA Mini WebSocket'
    }))
  })

  return wss
}

async function handleChatMessage(message: any, userId: string) {
  // Save to database
  await prisma.chatMessage.create({
    data: {
      roomId: message.roomId,
      userId,
      content: message.content,
      type: message.messageType || 'text'
    }
  })

  // Broadcast to all connected clients in the room
  // Implementation depends on your room management system
}

async function handleCommand(message: any, userId: string) {
  // Execute command and send progress updates
  const command = await prisma.command.create({
    data: {
      userId,
      command: message.command,
      args: message.args,
      status: 'running'
    }
  })

  // Simulate command execution
  setTimeout(async () => {
    await prisma.command.update({
      where: { id: command.id },
      data: {
        status: 'completed',
        result: 'Command executed successfully',
        executedAt: new Date()
      }
    })
  }, 3000)
}

async function handleBuildRequest(message: any, userId: string) {
  // Handle APK build requests
  const build = await prisma.buildHistory.create({
    data: {
      projectName: message.projectName || 'FEAC-WA-Mini',
      version: message.version || '1.0.0',
      status: 'building'
    }
  })

  // Simulate build process
  setTimeout(async () => {
    await prisma.buildHistory.update({
      where: { id: build.id },
      data: {
        status: 'success',
        outputPath: '/sdcard/Documents/Dikri/apk-release.apk'
      }
    })
  }, 10000)
}