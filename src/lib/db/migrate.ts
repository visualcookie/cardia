import 'dotenv/config'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!,
})

const db = drizzle(pool)

async function main() {
  console.log('Migration started...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('Migration completed!')

  pool.end()
  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed: ', e)

  pool.end()
  process.exit(0)
})

