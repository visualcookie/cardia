'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { AlertTriangleIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import SubmitButton from '@/components/SubmitButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signinSchema } from '@/lib/form-validations'
import { signin } from './actions'

export type SigninFields = z.infer<typeof signinSchema>

const SignInForm: React.FC = () => {
  const [pending, startTransition] = useTransition()
  const [waitCounter, setWaitCounter] = useState<number>(0)
  const [waitingForMagicLink, setWaitingForMagicLink] = useState<boolean>(false)
  const [signinError, setSigninError] = useState<string | undefined>(undefined)
  const form = useForm<SigninFields>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  })

  const onSubmit = async (formData: SigninFields) => {
    setSigninError(undefined)
    setWaitingForMagicLink(false)

    startTransition(async () => {
      const { success, message } = await signin(formData)

      if (!success) {
        setSigninError(message)
      }

      if (success) {
        setWaitCounter(30)
      }
    })
  }

  useEffect(() => {
    if (signinError) {
      setWaitingForMagicLink(false)
      setWaitCounter(0)
    }
  }, [signinError])

  useEffect(() => {
    let countdown: NodeJS.Timeout

    if (form.formState.isSubmitted && waitCounter > 0) {
      setWaitingForMagicLink(true)
      const duration = waitCounter * 1000

      countdown = setInterval(() => {
        setWaitCounter((prevCounter) => prevCounter - 1)
      }, 1000)

      setTimeout(() => {
        setWaitingForMagicLink(false)
        clearInterval(countdown)
      }, duration)
    }

    return () => {
      clearInterval(countdown)
    }
  }, [form.formState.isSubmitted, waitCounter])

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
