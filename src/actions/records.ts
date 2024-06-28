'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { parse } from 'date-fns'
import { db } from '@/db'
import { records } from '@/db/schema'
import { recordSchema } from '@/lib/form-validations'

export async function createRecord(
  userId: string,
  data: z.infer<typeof recordSchema>
) {
  const transformData = {
    recordedAt: parse(
      `${data.date} ${data.time}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    ),
    systolic: parseInt(data.systolic, 10),
    diastolic: parseInt(data.diastolic, 10),
    pulse: parseInt(data.pulse, 10),
  }

  const createRecord = await db
    .insert(records)
    .values({
      ...transformData,
      userId,
    })
    .returning()

  if (!createRecord) {
    throw new Error('Could not create record')
  }

  revalidatePath('/app')
}

export async function deleteRecord(recordId: string) {
  const deleteRecord = await db
    .delete(records)
    .where(eq(records.id, recordId))
    .returning()

  if (!deleteRecord) {
    throw new Error('Could not delete record')
  }

  revalidatePath('/app')
}
