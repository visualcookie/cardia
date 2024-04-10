'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createRecord } from '@/actions/records'
import { useAuth } from '@/providers/SupabaseAuthProvider'
import { DialogFooter } from './ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { DateTimePicker } from './ui/date-time-picker'

interface Props {
  closeDialog: () => void
}

export const newRecordSchema = z.object({
  recordedAt: z.date(),
  systolic: z.string().min(0).max(3),
  diastolic: z.string().min(0).max(2),
  pulse: z.string().min(0).max(3),
})

export type NewRecordFields = z.infer<typeof newRecordSchema>

const NewRecordForm: React.FC<Props> = ({ closeDialog }) => {
  const { user } = useAuth()
  const form = useForm<NewRecordFields>({
    resolver: zodResolver(newRecordSchema),
  })

  const onSubmit = async (data: NewRecordFields) => {
    try {
      await createRecord(user?.id ?? '', data)
      toast({
        title: 'Record created!',
        description: 'The record has been successfully created.',
      })
      closeDialog()
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Could not create the record. Please try again.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="systolic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Systolic</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="120" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diastolic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diastolic</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pulse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pulse</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="76" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recordedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Record date</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="minute"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button type="submit">Submit new record</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default NewRecordForm
