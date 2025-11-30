import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }

    return {
      error: false,
      message: 'Registration successful',
    }
  })
