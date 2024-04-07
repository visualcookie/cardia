'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import writeXlsxFile, { Schema } from 'write-excel-file'
import { newRecordSchema } from '@/components/NewRecordForm'
import { db } from '@/db'
import { records } from '@/db/schema'

export async function createRecord(
  userId: string,
  data: z.infer<typeof newRecordSchema>
) {
  const transformData = {
    ...data,
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

export async function exportRecords(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string

  try {
    const dbRecords = await db.query.records.findMany({
      where: eq(records.userId, userId),
    })

    if (dbRecords.length === 0) {
      return {
        title: 'Export failed',
        message: 'We could not find any records to export.',
      }
    }

    const schema: Schema<{
      recordedAt: Date
      systolic: number
      diastolic: number
      pulse: number
      id: string
      userId: string
    }> = [
      {
        column: 'Recorded at',
        type: Date,
        format: 'yyyy-mm-dd hh:mm:ss',
        value: (record) => record.recordedAt,
      },
      {
        column: 'Systolic',
        type: Number,
        value: (record) => record.systolic,
      },
      {
        column: 'Diastolic',
        type: Number,
        value: (record) => record.diastolic,
      },
      {
        column: 'Pulse',
        type: Number,
        value: (record) => record.pulse,
      },
    ]

    await writeXlsxFile(dbRecords, {
      schema,
      fileName: `records-${new Date().getTime()}.xlsx`,
    })

    console.table(dbRecords)

    return {
      title: 'Export successful',
      message: 'Your records have been exported successfully.',
    }
  } catch (error) {
    return {
      title: 'Export failed',
      message: 'Could not export records. Please try again.',
    }
  }
}
