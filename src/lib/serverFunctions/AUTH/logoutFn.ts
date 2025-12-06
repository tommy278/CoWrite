import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { error: true, message: error.message }
  }
  return { error: false, message: 'Successfully logged out' }
})
