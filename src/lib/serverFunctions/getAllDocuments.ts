import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'
import { JSONContent } from '@tiptap/react'

interface Document {
  id: string
  user_id: string
  title: string
  content: JSONContent
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  deleted: boolean
}

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
      return []
    }
    const documents = data as Document[]
    return documents.map((d) => ({
      id: d.id,
      user_id: d.user_id,
      title: d.title || 'Untitled Document',
      content: d.content,
      created_at: d.created_at,
      updated_at: d.updated_at,
      deleted_at: d.deleted_at,
      deleted: d.deleted,
    }))
  })
