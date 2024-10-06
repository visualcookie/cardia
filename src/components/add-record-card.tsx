'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { LoaderCircle, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { addUserReading } from '@/actions/records'
import { readingFormSchema, ReadingFormData } from '@/lib/form-validations'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const AddRecordCard: React.FC<{
  userId: string
  onCancel: () => void
}> = ({ userId, onCancel }) => {
  const form = useForm<ReadingFormData>({
    resolver: zodResolver(readingFormSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      systolic: undefined,
      diastolic: undefined,
      pulse: undefined,
    },
  })

  const onSubmit = async (data: ReadingFormData) => {
    try {
      const transformedData = {
        ...data,
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
      }

      await addUserReading(userId, transformedData)
      onCancel()
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-row items-center justify-between p-4 shadow rounded-md border bg-card hover:border-primary transition-colors duration-200 ease-in-out"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2 text-muted-foreground min-w-24">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col min-w-24">
          <FormField
            control={form.control}
            name="systolic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="outline-none focus-within:text-primary font-bold text-3xl bg-transparent"
                    placeholder="120"
                    size={3}
                    autoFocus
                    tabIndex={1}
                    maxLength={3}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">Systolic</p>
        </div>
        <div className="flex flex-col min-w-24">
          <FormField
            control={form.control}
            name="diastolic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-transparent outline-none focus-within:text-primary font-bold text-3xl"
                    placeholder="80"
                    size={3}
                    autoFocus
                    tabIndex={1}
                    maxLength={3}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">Diastolic</p>
        </div>
        <div className="flex flex-col min-w-24">
          <FormField
            control={form.control}
            name="pulse"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-transparent outline-none focus-within:text-primary font-bold text-3xl"
                    placeholder="80"
                    size={3}
                    autoFocus
                    tabIndex={1}
                    maxLength={3}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground">Pulse</p>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            type="submit"
            tabIndex={4}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span className="sr-only">Saving record</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="sr-only">Save record</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            tabIndex={5}
            disabled={form.formState.isSubmitting}
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
