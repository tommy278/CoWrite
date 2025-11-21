import { ReactNode } from 'react'
import { Editor } from '@tiptap/react'

interface ButtonCardProps {
  state: string
  children: ReactNode
  editor: Editor | null
}

export default function ButtonCard({
  editor,
  state,
  children,
}: ButtonCardProps) {
  return (
    <div
      className={`rounded-md p-1 px-2 ${editor?.isActive(state) ? 'bg-blue-500' : ''}`}
    >
      {children}
    </div>
  )
}
