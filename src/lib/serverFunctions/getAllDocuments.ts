import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const getAllDocumentsFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ user_id: z.string() }))
  .handler(async (ctx) => {
    const { user_id } = ctx.data
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user_id)
      .eq('deleted', false)
      .range(0, 9)

    if (error) {
      console.error('Error fetching single record', error.message)
      return null
    }

    if (data) {
      return data
    } else {
      console.log('No data found')
      return null
    }
  })
