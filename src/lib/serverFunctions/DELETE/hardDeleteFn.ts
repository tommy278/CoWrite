import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const hardDeleteFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async (ctx) => {
    const { id } = ctx.data
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.from('documents').delete().eq('id', id)

    if (error) throw new Error(error.message)
  })
