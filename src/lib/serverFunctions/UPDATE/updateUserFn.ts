import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ password: z.string() }))
  .handler(async (ctx) => {
    const { password } = ctx.data

    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.updateUser({
      password,
    })
    if (error) throw new Error(error.message)
  })
