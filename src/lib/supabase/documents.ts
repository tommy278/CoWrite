import { supabase } from './supabase'

interface documentProps {
  userId: string
  title: string
}

export async function createDocument({ userId, title }: documentProps) {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
  if (error) {
    console.error('Error creating document', error)
  }
  return data
}
