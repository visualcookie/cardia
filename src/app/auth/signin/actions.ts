// TODO: Implement validation
'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { signinSchema } from './signin-form'
import { SignInWithPasswordlessCredentials } from '@supabase/supabase-js'

export async function signin(formData: z.infer<typeof signinSchema>) {
  const supabase = createClient()

  const data = {
    email: formData.email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/auth/confirm',
    },
  } satisfies SignInWithPasswordlessCredentials

  const { error } = await supabase.auth.signInWithOtp(data)

  if (error) {
    console.log(error)
    throw new Error('Could not sign in. Please try again.')
  }
}
