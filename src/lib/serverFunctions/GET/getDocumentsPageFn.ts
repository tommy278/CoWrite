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
      ascending: z.boolean(),
    })
  )
  .handler(async ({ data }) => {
    const { user_id, page, pageSize, sort, deleted, ascending } = data
    const supabase = getSupabaseServerClient()

    const from = page * pageSize
    const to = from + pageSize - 1

    type Sort = 'created' | 'updated'

    function getSortColumn(sort: Sort, deleted: boolean) {
      if (sort === 'created') return 'created_at'
      return deleted ? 'deleted_at' : 'updated_at'
    }
    const sortOption = getSortColumn(sort, deleted)

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
      .order(sortOption, {
        ascending,
      })
      .range(from, to)

    if (error) throw error

    return {
      documents: docs as Document[],
      total: count ?? 0,
    }
  })
