'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { setProfile } from '@/actions/profile'
import { onboardingSchema } from '@/lib/form-validations'
import SubmitButton from '@/components/SubmitButton'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface OnboardingFormProps {
  userId: string
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ userId }) => {
  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
  })

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    try {
      await setProfile(userId, values)
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile picture (URL)</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-4 justify-between">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-8">
          <SubmitButton
            label="Continue"
            variant="default"
            pending={form.formState.isSubmitting}
            disabled={!form.formState.isValid || !form.formState.isDirty}
          />
        </div>
      </form>
    </Form>
  )
}
