import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'
import { Profile } from '@/lib/Constants/dataTypes'

export const updateDisplayNameFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), newDisplayName: z.string() }))
  .handler(async ({ data }) => {
    const { newDisplayName: display_name, id } = data
    const supabase = getSupabaseServerClient()

    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update({ display_name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    return updatedData?.[0] as Profile | null
  })
