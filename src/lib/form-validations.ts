import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email(),
})

export const userSettingsSchema = z.object({
  username: z.string(),
  email: z.string().email(),
})

export const readingFormSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:MM'),
    systolic: z.string().refine(
      (val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num >= 70 && num <= 250
      },
      { message: 'Systolic must be a number between 70 and 250' }
    ),
    diastolic: z.string().refine(
      (val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num >= 40 && num <= 150
      },
      { message: 'Diastolic must be a number between 40 and 150' }
    ),
    pulse: z.string().refine(
      (val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num >= 40 && num <= 200
      },
      { message: 'Pulse must be a number between 40 and 200' }
    ),
  })
  .refine(
    (data) => {
      const dateTime = new Date(`${data.date}T${data.time}`)
      return !isNaN(dateTime.getTime())
    },
    {
      message: 'Invalid date and time combination',
      path: ['date', 'time'],
    }
  )
  .transform((data) => ({
    ...data,
    systolic: parseInt(data.systolic, 10),
    diastolic: parseInt(data.diastolic, 10),
    pulse: parseInt(data.pulse, 10),
    createdAt: new Date(`${data.date}T${data.time}`),
  }))

export type ReadingFormData = z.infer<typeof readingFormSchema>
