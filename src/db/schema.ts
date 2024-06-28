import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

// Supabase Auth Schema
export const authSchema = pgSchema('auth')

// Users table in the auth schema
export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey().notNull(),
})

// Cardia Schema
export const cardiaSchema = pgSchema('cardia')

export const profile = cardiaSchema.table('profile', {
  id: uuid('id')
    .primaryKey()
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  username: text('username').unique(),
  email: varchar('email').notNull(),
  avatar: text('avatar'),
  dob: timestamp('dob'),
  weight: integer('weight'),
  height: integer('height'),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
})

export const profileRelations = relations(profile, ({ many }) => ({
  records: many(records),
}))

export const records = cardiaSchema.table('record', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  userId: uuid('user_id')
    .references(() => profile.id, { onDelete: 'cascade' })
    .notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  pulse: integer('pulse').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
})

export const recordsRelations = relations(records, ({ one }) => ({
  user: one(profile, {
    fields: [records.userId],
    references: [profile.id],
  }),
}))
