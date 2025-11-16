import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

export const exchangeCodeFn = createServerFn()
  .inputValidator(z.object({ code: z.string() }))
  .handler(async (ctx) => {
    const { code } = ctx.data
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error(error)
      throw new Error('Failed to exchange code')
    }

    const { session } = data

    setCookie('sb-access-token', session.access_token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    setCookie('sb-refresh-token', session.refresh_token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return { success: true }
  })
