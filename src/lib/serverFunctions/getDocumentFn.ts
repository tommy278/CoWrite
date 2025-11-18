import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { z } from 'zod'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

interface Document {
  id: string
  user_id: string
  title: string
  content: TiptapJSON | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  deleted: boolean
}

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
      const document: Document = {
        id: data.id,
        user_id: data.user_id,
        title: data.title || 'Untitled Document',
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        deleted_at: data.deleted_at,
        deleted: data.deleted,
      }
      return document
    } else {
      console.log('No data found')
      return null
    }
  })
