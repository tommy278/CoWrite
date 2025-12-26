import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

interface DocumentStats {
  total: number
  active: number
  deleted: number
  pinned: number
}

export const getDocumentStatsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.rpc('get_document_stats')
    if (error) {
      throw error
    }
    const stats = data?.[0] ?? null
    return stats as DocumentStats
  }
)
