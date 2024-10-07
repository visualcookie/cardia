'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'

export async function signinAction(formData: { email: string }) {
  try {
    await signIn('resend', formData)
    return {
      status: 'success',
      message: `A magic link has been sent to ${formData.email}`,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    throw error
  }
}
