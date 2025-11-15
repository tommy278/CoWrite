import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/lib/supabase/clientSupabase"

export const getUserFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('Error fetching user:', error?.message)
    return null
  }

  return user
})

