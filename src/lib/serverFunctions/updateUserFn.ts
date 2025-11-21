import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { password: string }) => d)
  .handler(async (ctx) => {
    const { password } = ctx.data

    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.updateUser({
      password,
    })
    if (error) throw new Error(error.message)
  })
