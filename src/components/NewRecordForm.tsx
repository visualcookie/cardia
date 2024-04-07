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
  FormDescription,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'

interface Props {
  closeDialog: () => void
}

export const newRecordSchema = z.object({
  recordedAt: z.date().optional(),
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
              <FormLabel>
                Record date{' '}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>When did you record that?</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                If empty, the current date will be used.
              </FormDescription>
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
