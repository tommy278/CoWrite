import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'

export const createDocumentFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { title: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    // --- Add this block ---
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      // Check your *server console/terminal* for this message
      console.error('RLS FAILURE: User is null, cookies likely not sent/read.')
      throw new Error('You must be logged in to create a document.')
    }
    console.log('Server authenticated user:', user.id)
    // --- End block ---

    const { data: newDoc, error } = await supabase
      .from('documents')
      .insert([{ title: data.title }])
      .select()

    if (error) throw new Error(error.message)
    return newDoc?.[0]
  })
