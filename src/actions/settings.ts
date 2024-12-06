'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export async function updateUserSettings(
  userId: string,
  data: {
    username?: string
    email?: string
    avatar?: string
  }
) {
  try {
    await db
      .update(users)
      .set({
        name: data.username,
        email: data.email,
        image: data.avatar,
      })
      .where(eq(users.id, userId))

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to update user settings:', error)
    return { success: false, error: 'Failed to update user settings' }
  }
}

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  try {
    await db
      .update(users)
      .set({
        image: avatarUrl,
      })
      .where(eq(users.id, userId))

    revalidatePath('/settings')
    return { success: true, avatarUrl }
  } catch (error) {
    console.error('Failed to update user avatar:', error)
    return { success: false, error: 'Failed to update user avatar' }
  }
}

export async function deleteUserAvatar(userId: string) {
  try {
    await db
      .update(users)
      .set({
        image: null,
      })
      .where(eq(users.id, userId))

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete user avatar:', error)
    return { success: false, error: 'Failed to delete user avatar' }
  }
}
