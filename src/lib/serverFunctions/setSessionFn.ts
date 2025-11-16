import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

export const setSessionFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { access_token: string; refresh_token: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { error: false, message: 'Successfully created session' }
  })
