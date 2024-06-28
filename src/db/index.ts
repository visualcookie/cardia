import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DB_URL!

const client = postgres(connectionString)
export const db = drizzle(client, { schema: schema, logger: true })
