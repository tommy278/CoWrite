import { ReactNode } from 'react'
import { Editor } from '@tiptap/react'
import ToolTip from './ToolTip'

interface ButtonCardProps {
  state?: string
  children: ReactNode
  editor?: Editor | null
  className?: string
  text?: string
  mobileDisplay?: boolean
  direction?: 'top' | 'bottom' | 'right' | 'left'
  dropdown?: boolean
}

export default function ButtonCard({
  editor,
  state,
  children,
  className = '',
  text,
  mobileDisplay,
  direction,
  dropdown,
}: ButtonCardProps) {
  const isActive = state ? editor?.isActive(state) : false
  const classes = `flex text-xs sm:text-sm md:text-base items-center rounded-md p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 h-full ${isActive ? 'bg-blue-300' : ''} ${className} ${mobileDisplay ? 'hidden md:flex' : ''} ${dropdown ? 'justify-start' : 'justify-center'}`
  if (text) {
    return (
      <ToolTip text={text} direction={direction ?? 'bottom'}>
        <div className={classes}>{children}</div>
      </ToolTip>
    )
  } else return <div className={classes}>{children}</div>
}
