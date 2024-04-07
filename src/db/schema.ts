import { relations, sql } from 'drizzle-orm'
import { integer, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const authSchema = pgSchema('auth')

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey().notNull(),
})

export const cardiaSchema = pgSchema('cardia')

export const users = cardiaSchema.table('users', {
  id: uuid('id')
    .primaryKey()
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  username: text('username'),
  profilePicture: text('profile_picture'),
})

export const usersRelations = relations(users, ({ many }) => ({
  records: many(records),
}))

export const records = cardiaSchema.table('record', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  systolic: integer('systolic').notNull(),
  diastolic: integer('diastolic').notNull(),
  pulse: integer('pulse').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
})

export const recordsRelations = relations(records, ({ one }) => ({
  user: one(users, {
    fields: [records.userId],
    references: [users.id],
  }),
}))
