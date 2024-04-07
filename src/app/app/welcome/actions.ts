// TODO: Implement validation
'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { onboardingSchema } from './onboarding-form'

export async function setupUser(
  formData: z.infer<typeof onboardingSchema>,
  userId: string
) {
  const setupUser = await db
    .update(users)
    .set({
      username: formData.username,
      profilePicture: formData.profilePicture,
    })
    .where(eq(users.id, userId))
    .returning()

  if (!setupUser) {
    throw new Error('Could not set up user')
  }

  redirect('/app')
}
