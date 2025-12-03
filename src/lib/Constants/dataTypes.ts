import { JSONContent } from '@tiptap/react'

export interface Document {
  id: string
  user_id: string
  title: string
  content: JSONContent
  created_at: Date
  updated_at: Date
  deleted_at: Date
  deleted: boolean
}
