import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  migrations: {
    table: 'migrations',
    schema: 'cardia',
  },
  schema: './src/db/schema.ts',
  out: './drizzle',
})
