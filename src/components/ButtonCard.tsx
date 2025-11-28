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
      className={`rounded-md ${editor?.isActive(state) ? 'bg-gray-200/100' : ''}`}
    >
      {children}
    </div>
  )
}
