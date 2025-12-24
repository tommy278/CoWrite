import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const pinDocumentFn = createServerFn()
  .inputValidator(
    z.object({
      id: z.string(),
      pinned: z.boolean(),
    })
  )
  .handler(async (ctx) => {
    const { id, pinned } = ctx.data

    const supabase = getSupabaseServerClient()
    const { data: updatedData, error } = await supabase
      .from('documents')
      .update({ pinned: !pinned })
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    return updatedData?.[0] ?? null
  })
