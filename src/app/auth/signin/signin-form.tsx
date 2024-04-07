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
import { toast } from '@/components/ui/use-toast'
import SubmitButton from '@/components/SubmitButton'
import { signin } from './actions'

export const signinSchema = z.object({
  email: z.string().email(),
})

const SignInForm: React.FC = () => {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      await signin(data)
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the magic link.',
      })
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description:
          'Could not sign in. Please check your email and try again.',
      })
    }
  }

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
                  type="email"
                  placeholder="johnny@minefield.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          label="Request magic link"
          labelPending="Getting your magic link"
          variant="default"
          className="w-full"
        />
      </form>
    </Form>
  )
}

export default SignInForm
