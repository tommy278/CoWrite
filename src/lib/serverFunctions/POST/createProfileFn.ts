import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase/clientSupabase'
import { Profile } from '@/lib/Constants/dataTypes'
import { z } from 'zod'

export const createProfileFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      display_name: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: data.id,
        display_name: data.display_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return profile as Profile
  })
