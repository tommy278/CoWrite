import { z } from 'zod'

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')

const containsUppercase = (val: string) => /[A-Z]/.test(val)
const containsLowercase = (val: string) => /[a-z]/.test(val)
const containsNumber = (val: string) => /\d/.test(val)
const containsSpecialCharacter = (val: string) =>
  /[!@#$%^&*(),.?":{}|<>]/.test(val)

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(50, 'Password is too long')
  .refine(containsUppercase, {
    message: 'Must contain at least one uppercase letter',
  })
  .refine(containsLowercase, {
    message: 'Must contain at least one lowercase letter',
  })
  .refine(containsNumber, { message: 'Must contain at least one number' })
  .refine(containsSpecialCharacter, {
    message: 'Must contain at least one special character',
  })
