import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

export const getDocumentFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async (ctx) => {
    const { id } = ctx.data
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

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
