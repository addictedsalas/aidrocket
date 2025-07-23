import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'

export async function createContext({
  req,
}: {
  req: NextRequest
}) {
  // For now, skip session checking to avoid auth function error
  // We'll make endpoints public for testing the property parser
  // const session = null
  const userId = null
  
  if (!db) {
    throw new Error('Database connection not available')
  }
  
  return {
    db,
    user: null,
    userId,
    req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>