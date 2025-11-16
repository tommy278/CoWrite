import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

export const createDocumentFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { title: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: newDoc, error } = await supabase
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
    return newDoc?.[0]
  })
