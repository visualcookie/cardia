'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { readingFormSchema } from '@/lib/form-validations'
import { addReading, deleteReadingById } from '@/lib/db/queries'

export async function addUserReading(
  userId: string,
  data: z.infer<typeof readingFormSchema>
) {
  const reading = await addReading(userId, data)

  if (!reading) {
    throw new Error('Could not create record')
  }

  revalidatePath('/app')
}

export async function deleteUserReading(recordId: string) {
  const reading = await deleteReadingById(recordId)

  if (!reading) {
    throw new Error('Could not delete record')
  }

  revalidatePath('/app')
}
