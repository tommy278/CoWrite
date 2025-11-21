import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

export const resetPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string }) => data)
  .handler(async (ctx) => {
    const { email } = ctx.data
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/reset-password`,
    })
    if (error) throw new Error(error.message)
  })
