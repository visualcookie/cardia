'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Check } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfile } from '@/actions/profile'
import { profileSchema } from '@/lib/form-validations'
import SubmitButton from '@/components/SubmitButton'
import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface ProfileFormProps {
  profileData?: {
    id: string
    username: string | null
    email: string | null
    avatar: string | null
    dob: string | Date | null
    weight: string | number | null | undefined
    height: string | number | null | undefined
  }
  userId: string
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  userId,
}) => {
  const [success, setSuccess] = useState<boolean>(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (!profileData) return

    form.reset({
      username: profileData.username ?? '',
      email: profileData.email ?? '',
      avatar: profileData.avatar ?? '',
      dob: profileData.dob
        ? new Date(profileData.dob).toISOString().split('T')[0]
        : '',
      weight: profileData.weight ?? '',
      height: profileData.height ?? '',
    })
  }, [profileData])

  useEffect(() => {
    // auto-hide success message after 3 seconds
    let timer: NodeJS.Timeout

    if (form.formState.isSubmitSuccessful) {
      timer = setTimeout(() => {
        setSuccess(false)
      }, 5000)
    }

    return () => clearTimeout(timer)
  }, [form.formState.isSubmitSuccessful])

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile(userId, values)
      setSuccess(true)
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" disabled {...field} />
                </FormControl>
                <FormDescription>
                  Your email address is not editable.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h2 className="text-lg font-medium">Personal information</h2>
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
        <div className="flex flex-row gap-4 justify-between">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex justify-between">
                  Weight (kg)
                  <span className="text-muted-foreground text-xs">
                    optional
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex justify-between">
                  Height (cm)
                  <span className="text-muted-foreground text-xs">
                    optional
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between mt-8">
          <div className="inline-flex gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={!form.formState.isDirty}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <SubmitButton
              label="Save changes"
              variant="default"
              pending={form.formState.isSubmitting}
              disabled={!form.formState.isValid || !form.formState.isDirty}
            />
          </div>

          {success && (
            <FormMessage className="inline-flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully</span>
            </FormMessage>
          )}
        </div>
      </form>
    </Form>
  )
}
