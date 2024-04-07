'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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
import { setupUser } from './actions'
import { useAuth } from '@/providers/SupabaseAuthProvider'

export const onboardingSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  profilePicture: z.string().url('Profile picture must be a valid URL'),
})

const OnboardingForm: React.FC = () => {
  const auth = useAuth()
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
  })

  const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
    try {
      await setupUser(data, auth.user?.id ?? '')
      toast({
        title: 'Ready to go!',
        description: 'You can now start using the app.',
      })
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Could not set up your profile. Please try again.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="j.cash" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile picture (URL)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://mighty.tools/mockmind-api/content/alien/7.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Set up profile
        </Button>
      </form>
    </Form>
  )
}

export default OnboardingForm
