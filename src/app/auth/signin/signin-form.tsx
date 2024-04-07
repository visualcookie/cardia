'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SubmitButton from '@/components/SubmitButton'
import { signin } from './actions'
import { signinSchema } from '@/lib/form-validations'
import { useEffect, useState, useTransition } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangleIcon } from 'lucide-react'

export type SigninFields = z.infer<typeof signinSchema>

const SignInForm: React.FC = () => {
  const [pending, startTransition] = useTransition()
  const [waitCounter, setWaitCounter] = useState<number>(30)
  const [waitingForMagicLink, setWaitingForMagicLink] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<string | null>(null)
  const form = useForm<SigninFields>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  })

  const onSubmit = async (formData: SigninFields) => {
    startTransition(async () => {
      try {
        await signin(formData)
      } catch (error) {
        if (error instanceof Error) {
          setSigninError(error.message)
        }
      }
    })
  }

  useEffect(() => {
    let countdown: NodeJS.Timeout

    if (!pending && !signinError) {
      if (form.formState.isSubmitSuccessful) {
        setWaitingForMagicLink(true)
        const duration = waitCounter * 1000

        const countdown = setTimeout(() => {
          setWaitCounter((prevCounter) => prevCounter - 1)
        }, 1000)

        setTimeout(() => {
          setWaitingForMagicLink(false)
          clearInterval(countdown)
        }, duration)
      }
    }

    return () => {
      if (countdown) {
        clearInterval(countdown)
      }
    }
  }, [form.formState.isSubmitSuccessful, waitCounter, pending, signinError])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  autoComplete="email"
                  type="email"
                  placeholder="johnny@minefield.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {signinError && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="w-5 h-5 mr-2" />
            <AlertDescription>{signinError}</AlertDescription>
          </Alert>
        )}
        {waitingForMagicLink && (
          <Alert>
            <AlertDescription>
              If an account with this email exists, you will receive a magic
              link in your inbox.
            </AlertDescription>
          </Alert>
        )}
        <SubmitButton
          label={
            waitingForMagicLink
              ? `Try again in ${waitCounter} seconds`
              : `Request magic link`
          }
          variant="default"
          className="w-full"
          pending={pending}
          disabled={!form.formState.isValid || waitingForMagicLink}
        />
      </form>
    </Form>
  )
}

export default SignInForm
