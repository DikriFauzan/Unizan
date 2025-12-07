import { CreateNextContextOptions } from '@trpc/server/adapters/next'

export function createContext(opts: CreateNextContextOptions) {
  const { req, res } = opts
  
  // Get user from session/token
  const user = null // TODO: Implement session validation
  
  return {
    req,
    res,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>