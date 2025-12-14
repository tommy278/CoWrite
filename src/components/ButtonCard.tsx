import { ReactNode } from 'react'
import { Editor } from '@tiptap/react'

interface ButtonCardProps {
  state?: string
  children: ReactNode
  editor: Editor | null
  className?: string
}

export default function ButtonCard({
  editor,
  state,
  children,
  className = '',
}: ButtonCardProps) {
  const isActive = state ? editor?.isActive(state) : false
  const classes = `inline-flex h-fit w-fit items-center rounded-md p-2 hover:bg-blue-400 ${isActive ? 'bg-blue-300' : ''} ${className}`
  return <div className={classes}>{children}</div>
}
