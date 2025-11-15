import { parse } from 'cookie'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase' // server-side supabase client

export async function getUserFromCookiesFn(cookieHeader?: string | null) {
  if (!cookieHeader) return null
  const cookies = parse(cookieHeader)
  const access_token = cookies['sb-access-token']

  if (!access_token) return null

  const supabaseServer = getSupabaseServerClient()

  const { data } = await supabaseServer.auth.getUser(access_token)
  return data.user ?? null
}
