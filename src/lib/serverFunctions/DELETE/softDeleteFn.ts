import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const softDeleteFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async (ctx) => {
    const { id } = ctx.data
    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('documents')
      .update({ deleted: true, deleted_at: new Date() })
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
  })
