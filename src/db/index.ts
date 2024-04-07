import 'dotenv/config'
import { Client } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const connectionString = process.env.DB_URL!
const client = new Client({
  connectionString: connectionString,
})

const connectDatabase = async () => {
  try {
    await client.connect()
  } catch (e) {
    console.error('Failed to connect to the database', e)
  }
}

connectDatabase()
export const db = drizzle(client, { schema: schema, logger: true })
