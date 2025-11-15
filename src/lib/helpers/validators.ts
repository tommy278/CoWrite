import { z } from 'zod'

const containsSpecialCharacters = (str: string) => {
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  return specialCharsRegex.test(str)
}

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')

export const passwordSchema = z
  .string()
  .min(7, 'Password must be at least 7 characters')
  .max(50, 'Password is too long')
  .refine(containsSpecialCharacters, {
    message: 'Must be at least one special character',
  })
