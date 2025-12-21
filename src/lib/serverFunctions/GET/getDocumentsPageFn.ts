import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'
import { Document } from '@/lib/Constants/dataTypes'

export const getDocumentPageFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      user_id: z.string(),
      page: z.number(),
      pageSize: z.number(),
      sort: z.enum(['updated', 'created']),
      deleted: z.boolean(),
    })
  )
  .handler(async ({ data }) => {
    const { user_id, page, pageSize, sort, deleted } = data
    const supabase = getSupabaseServerClient()

    const from = page * pageSize
    const to = from + pageSize - 1

    const {
      data: docs,
      count,
      error,
    } = await supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('user_id', user_id)
      .eq('deleted', deleted)
      .order('pinned', { ascending: false })
      .order(sort === 'updated' ? 'updated_at' : 'created_at', {
        ascending: false,
      })
      .range(from, to)

    if (error) throw error

    return {
      documents: docs as Document[],
      total: count ?? 0,
    }
  })
