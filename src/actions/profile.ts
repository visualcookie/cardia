'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { profile } from '@/db/schema'
import { profileSchema } from '@/lib/form-validations'

export async function updateProfile(
  userId: string,
  data: z.infer<typeof profileSchema>
) {
  const transformedData = {
    ...data,
    dob: data.dob ? new Date(data.dob) : null,
    weight: data.weight ? Number(data.weight) : null,
    height: data.height ? Number(data.height) : null,
  }

  const updateProfile = await db
    .update(profile)
    .set(transformedData)
    .where(eq(profile.id, userId))
    .returning()

  if (!updateProfile) {
    throw new Error('Could not update profile')
  }

  revalidatePath('/app')
}
