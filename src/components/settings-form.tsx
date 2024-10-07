'use client'

import { User } from 'next-auth'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSettingsSchema } from '@/lib/form-validations'
import { updateUserSettings } from '@/actions/settings'
import { Input } from './ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import SubmitButton from './submit-button'
import AvatarUpload from './avatar-upload'
import { useToast } from './ui/use-toast'

interface SettingsFormProps {
  user?: User
}

const SettingsForm: React.FC<SettingsFormProps> = ({ user }) => {
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(null)

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.image)
      setIsLoading(false)
    }
  }, [user])

  const form = useForm<any>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      username: '',
      email: '',
      avatar: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.name ?? '',
        email: user.email ?? '',
        avatar: user.image ?? '',
      })
    }
  }, [user, form])

  if (isLoading) return <div>Loading ...</div>
  if (!user) return null

  const onSubmit = async (data: FormData) => {
    const updatedSettings = { ...data, avatar: avatarUrl ?? undefined }
    const result = await updateUserSettings(user.id!, updatedSettings)

    if (!result.success) {
      return toast({
        title: 'Update failed',
        description:
          result.error || 'An error occurred while updating your settings.',
        variant: 'destructive',
      })
    }

    return toast({
      title: 'Settings updated',
      description: 'Your settings have been successfully updated.',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AvatarUpload
          userId={user.id!}
          currentAvatarUrl={avatarUrl ?? undefined}
          onAvatarChange={(url) => setAvatarUrl(url)}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          label="Update settings"
          disabled={
            form.formState.isSubmitting ||
            form.formState.isDirty ||
            !form.formState.isValid
          }
        />
      </form>
    </Form>
  )
}

export default SettingsForm
