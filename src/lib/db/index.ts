import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

let db: ReturnType<typeof drizzle<typeof schema>> | null = null

if (connectionString) {
  // Disable prefetch as it's not supported for "Transaction" pool mode
  const client = postgres(connectionString, { prepare: false })
  db = drizzle(client, { schema })
} else if (process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL is required in production')
}

export { db }