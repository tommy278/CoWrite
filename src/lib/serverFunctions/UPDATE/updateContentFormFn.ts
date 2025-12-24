import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { JSONContent } from '@tiptap/react'

export const updateContentFormFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; content: JSONContent }) => data)
  .handler(async ({ data }) => {
    const { id, content } = data
    const supabase = getSupabaseServerClient()

    const { data: updatedData, error } = await supabase
      .from('documents')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    return updatedData?.[0] ?? null
  })
