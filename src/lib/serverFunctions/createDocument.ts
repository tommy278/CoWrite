import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

interface Document {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export const createDocumentFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { title: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: result, error } = await supabase
      .from('documents')
      .insert([
        {
          title: data.title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    const newDoc = result as Document[]
    return newDoc?.[0]
  })
