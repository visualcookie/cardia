'use server'

import { SignInWithPasswordlessCredentials } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { SigninFields } from './signin-form'

export async function signin(formData: SigninFields) {
  const supabase = createClient()

  const data = {
    email: formData.email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/auth/confirm',
    },
  } satisfies SignInWithPasswordlessCredentials

  const { error } = await supabase.auth.signInWithOtp(data)

  if (error) {
    return {
      success: false,
      message: error.code,
    }
  }

  return {
    success: true,
    message: 'A magic link has been sent to your email address.',
  }
}
