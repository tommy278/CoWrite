import { ReactNode } from 'react'
import { Editor } from '@tiptap/react'
import ToolTip from './ToolTip'

interface ButtonCardProps {
  state?: string
  children: ReactNode
  editor: Editor | null
  className?: string
  text?: string
  mobileDisplay?: boolean
}

export default function ButtonCard({
  editor,
  state,
  children,
  className = '',
  text,
  mobileDisplay,
}: ButtonCardProps) {
  const isActive = state ? editor?.isActive(state) : false
  const classes = `flex md:h-fit md:w-fit items-center rounded-md p-1 md:p-2 md:hover:bg-blue-400 ${isActive ? 'bg-blue-300' : ''} ${className} ${mobileDisplay ? 'hidden md:flex' : ''}`
  if (text) {
    return (
      <ToolTip text={text}>
        <div className={classes}>{children}</div>
      </ToolTip>
    )
  } else return <div className={classes}>{children}</div>
}
