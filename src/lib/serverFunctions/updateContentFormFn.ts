import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

export const updateContentFormFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; content: TiptapJSON }) => data)
  .handler(async ({ data }) => {
    const { id, content } = data
    const supabase = getSupabaseServerClient()

    const { data: updatedData, error } = await supabase
      .from('documents')
      .update({ content, updated_at: new Date() })
      .eq('id', id)
      .select()

    if (error) throw new Error(error.message)
    return updatedData?.[0] ?? null
  })
