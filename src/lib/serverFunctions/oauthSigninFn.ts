import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const ALLOWED_PROVIDERS = ['google', 'github'] as const
type Provider = (typeof ALLOWED_PROVIDERS)[number]

export const oauthSigninFn = createServerFn()
  .inputValidator(z.enum(['google', 'github']))
  .handler(async (ctx) => {
    const provider = ctx.data
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as unknown as Provider,
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
        queryParams: {
          flow_type: 'pkce',
        },
      },
    })

    if (error) throw new Error(error.message)

    return { url: data.url }
  })
