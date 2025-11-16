import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const updateTitleFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), title: z.string() }))
  .handler(async ({ data }) => {
    const { id, title } = data

    const supabase = getSupabaseServerClient()
    const { data: updatedData, error } = await supabase
      .from('documents')
      .update([{ title }])
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    return updatedData?.[0] ?? null
  })
