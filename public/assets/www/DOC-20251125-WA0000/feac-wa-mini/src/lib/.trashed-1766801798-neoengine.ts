import { PrismaClient } from '@prisma/client'
import CryptoJS from 'crypto-js'

const prisma = new PrismaClient()

export interface NeoEngineCommand {
  version: number
  nonce: string
  timestamp: string
  source: string
  destination: string
  command: string
  payload: any
  signature: string
}

export interface NeoEngineEvent {
  eventType: string
  source: string
  destination: string
  data: any
  timestamp: string
}

export class NeoEngineClient {
  private baseUrl: string
  private wsUrl: string
  private apiKey: string
  private ws: WebSocket | null = null
  private messageQueue: NeoEngineCommand[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(baseUrl: string = 'http://localhost:8080', apiKey: string = 'neoengine-api-key') {
    this.baseUrl = baseUrl
    this.wsUrl = baseUrl.replace('http', 'ws') + '/ws'
    this.apiKey = apiKey
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl)
        
        this.ws.onopen = () => {
          console.log('Connected to NeoEngine WebSocket')
          this.reconnectAttempts = 0
          this.flushMessageQueue()
          resolve()
        }

        this.ws.onclose = () => {
          console.log('Disconnected from NeoEngine WebSocket')
          this.scheduleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('NeoEngine WebSocket error:', error)
          reject(error)
        }

        this.ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data)
            await this.handleMessage(message)
          } catch (error) {
            console.error('Error handling NeoEngine message:', error)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async sendCommand(command: NeoEngineCommand): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(command))
      
      // Log to database
      await prisma.neoEngineLog.create({
        data: {
          eventType: 'command_sent',
          source: command.source,
          destination: command.destination,
          command: command.command,
          payload: command.payload,
          signature: command.signature
        }
      })
    } else {
      // Queue message for later
      this.messageQueue.push(command)
    }
  }

  async handleMessage(message: any): Promise<void> {
    // Log incoming message
    await prisma.neoEngineLog.create({
      data: {
        eventType: message.eventType || 'unknown',
        source: message.source || 'neoengine',
        destination: 'feac-wa-core',
        command: message.command || '',
        payload: message.data || message,
        signature: 'received'
      }
    })

    // Handle different event types
    switch (message.eventType) {
      case 'build_started':
        await this.handleBuildStarted(message)
        break
      case 'build_progress':
        await this.handleBuildProgress(message)
        break
      case 'build_failed':
        await this.handleBuildFailed(message)
        break
      case 'npc_state':
        await this.handleNPCState(message)
        break
      case 'game_runtime_exception':
        await this.handleGameException(message)
        break
      case 'analytics_event':
        await this.handleAnalyticsEvent(message)
        break
      default:
        console.log('Unknown NeoEngine event:', message.eventType)
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)
      
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect().catch(console.error)
      }, delay)
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const command = this.messageQueue.shift()
      if (command && this.ws) {
        this.ws.send(JSON.stringify(command))
      }
    }
  }

  private async handleBuildStarted(message: any): Promise<void> {
    console.log('Build started:', message.data)
    // Send notification to chat
  }

  private async handleBuildProgress(message: any): Promise<void> {
    console.log('Build progress:', message.data.progress)
    // Update progress in UI
  }

  private async handleBuildFailed(message: any): Promise<void> {
    console.error('Build failed:', message.data.error)
    // Trigger auto-fix if enabled
  }

  private async handleNPCState(message: any): Promise<void> {
    console.log('NPC state update:', message.data)
    // Update NPC state in AdminCore
  }

  private async handleGameException(message: any): Promise<void> {
    console.error('Game exception:', message.data)
    
    // Create command for auto-fix
    const command: NeoEngineCommand = {
      version: 1,
      nonce: generateNonce(),
      timestamp: new Date().toISOString(),
      source: 'feac-wa-core',
      destination: 'neoengine',
      command: 'apply_fix',
      payload: {
        exception: message.data,
        fixType: 'runtime_error'
      },
      signature: generateSignature('apply_fix', message.data)
    }

    await this.sendCommand(command)
  }

  private async handleAnalyticsEvent(message: any): Promise<void> {
    // Store analytics data
    await prisma.analyticsMetrics.create({
      data: {
        metricType: message.data.eventType,
        value: message.data.value || 1,
        metadata: message.data.metadata || {}
      }
    })
  }

  async sendBuildCommand(projectPath: string, outputPath: string): Promise<void> {
    const command: NeoEngineCommand = {
      version: 1,
      nonce: generateNonce(),
      timestamp: new Date().toISOString(),
      source: 'feac-wa-core',
      destination: 'neoengine',
      command: 'build_project',
      payload: {
        projectPath,
        outputPath,
        buildType: 'release'
      },
      signature: generateSignature('build_project', { projectPath, outputPath })
    }

    await this.sendCommand(command)
  }

  async sendAnalyticsRequest(metrics: string[]): Promise<void> {
    const command: NeoEngineCommand = {
      version: 1,
      nonce: generateNonce(),
      timestamp: new Date().toISOString(),
      source: 'feac-wa-core',
      destination: 'neoengine',
      command: 'get_analytics',
      payload: { metrics },
      signature: generateSignature('get_analytics', { metrics })
    }

    await this.sendCommand(command)
  }
}

function generateNonce(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function generateSignature(command: string, payload: any): string {
  const message = `${command}:${JSON.stringify(payload)}`
  return CryptoJS.HmacSHA256(message, 'neoengine-secret-key').toString()
}

export const neoEngineClient = new NeoEngineClient()