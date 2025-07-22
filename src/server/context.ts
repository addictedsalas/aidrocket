import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function createContext({
  req,
}: {
  req: NextRequest
}) {
  const { userId } = await auth()
  
  if (!db) {
    throw new Error('Database connection not available')
  }
  
  return {
    db,
    userId,
    req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>