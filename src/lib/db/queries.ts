import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '.'
import { readings } from './schema'
import { readingFormSchema } from '../form-validations'

export const getAllReadingsByUser = async (userId: string) => {
  const records = await db.query.readings.findMany({
    where: eq(readings.userId, userId),
    orderBy: desc(readings.createdAt),
  })

  return records
}

export const addReading = async (
  userId: string,
  data: z.infer<typeof readingFormSchema>
) => {
  const record = await db
    .insert(readings)
    .values({
      ...data,
      userId,
    })
    .returning()

  return record
}

export const deleteReadingById = async (id: string) => {
  const record = await db.query.readings.findFirst({
    where: eq(readings.id, id),
  })

  if (!record) {
    return null
  }

  await db.delete(readings).where(eq(readings.id, id))
  return record
}
