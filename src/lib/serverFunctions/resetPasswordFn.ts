import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const resetPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ email: z.string() }))
  .handler(async (ctx) => {
    const { email } = ctx.data
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/reset-password`,
    })
    if (error) throw new Error(error.message)
  })
