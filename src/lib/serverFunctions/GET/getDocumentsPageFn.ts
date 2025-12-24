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
      sort: z.enum(['updated', 'created']).optional(),
      deleted: z.boolean(),
      ascending: z.boolean().optional(),
      pinned: z.boolean().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { user_id, page, pageSize, sort, deleted, ascending, pinned } = data
    const supabase = getSupabaseServerClient()

    const from = page * pageSize
    const to = from + pageSize - 1

    type Sort = 'created' | 'updated'

    function getSortColumn(sort: Sort, deleted: boolean) {
      if (sort === 'created') return 'created_at'
      return deleted ? 'deleted_at' : 'updated_at'
    }
    const sortOption = getSortColumn(sort ?? 'updated', deleted)

    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('user_id', user_id)
      .eq('deleted', deleted)

    if (!deleted) {
      query = query.order('pinned', { ascending: false })
    }

    if (pinned) {
      query = query.eq('pinned', pinned)
    }

    query = query.order(sortOption, { ascending }).range(from, to)
    const { data: docs, count, error } = await query

    if (error) throw error

    return {
      documents: docs as Document[],
      total: count ?? 0,
    }
  })
