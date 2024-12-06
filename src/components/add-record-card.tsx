'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, LoaderCircle, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { addUserReading, updateUserReading } from '@/actions/records'
import { readingFormSchema, ReadingFormData } from '@/lib/form-validations'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type AddRecordCardProps =
  | {
      userId: string
      valueId?: never
      values?: ReadingFormData
      onCancel: () => void
    }
  | {
      userId?: never
      valueId: string
      values?: ReadingFormData
      onCancel: () => void
    }

export const AddRecordCard: React.FC<AddRecordCardProps> = ({
  userId,
  valueId,
  values,
  onCancel,
}) => {
  const form = useForm<ReadingFormData>({
    resolver: zodResolver(readingFormSchema),
    defaultValues: {
      date: format(new Date(values?.createdAt || new Date()), 'yyyy-MM-dd'),
      time: format(new Date(values?.createdAt || new Date()), 'HH:mm'),
      // @ts-expect-error - TODO: fix this
      systolic: values?.systolic?.toString() || undefined,
      // @ts-expect-error - TODO: fix this
      diastolic: values?.diastolic?.toString() || undefined,
      // @ts-expect-error - TODO: fix this
      pulse: values?.pulse?.toString() || undefined,
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

      if (!!valueId) {
        await updateUserReading(valueId, transformedData)
      } else {
        await addUserReading(userId!, transformedData)
      }

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
        {['systolic', 'diastolic', 'pulse'].map((name) => (
          <div key={name} className="flex flex-col min-w-24">
            <FormField
              control={form.control}
              name={name as keyof ReadingFormData}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={field.value?.toString() || ''}
                        className={cn(
                          'bg-transparent outline-none focus-within:text-primary font-bold text-3xl',
                          form.formState.errors[
                            name as keyof ReadingFormData
                          ] && 'border-destructive'
                        )}
                        placeholder={name === 'systolic' ? '120' : '80'}
                        size={3}
                        autoFocus
                        tabIndex={1}
                        maxLength={3}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      {form.formState.errors[name as keyof ReadingFormData] && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-destructive absolute right-2 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {
                                  form.formState.errors[
                                    name as keyof ReadingFormData
                                  ]?.message
                                }
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="text-muted-foreground">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </p>
          </div>
        ))}
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
