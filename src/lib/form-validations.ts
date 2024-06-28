import { z } from 'zod'

export const signinSchema = z.object({
  email: z.string().email(),
})

export const recordSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  time: z.string().min(1, { message: 'Time is required' }),
  systolic: z.string().min(1, { message: 'Systolic is required' }).max(3),
  diastolic: z.string().min(1, { message: 'Diastolic is required' }).max(3),
  pulse: z.string().min(1, { message: 'Pulse is required' }).max(3),
})

export const profileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  avatar: z.string().url(),
  dob: z.string(),
  weight: z.string().optional(),
  height: z.string().optional(),
})
