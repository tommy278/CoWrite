import { ReactNode } from 'react'
import { Editor } from '@tiptap/react'

interface ButtonCardProps {
  state: string | null
  children: ReactNode
  editor: Editor | null
  className?: string
}

export default function ButtonCard({
  editor,
  state,
  children,
  className,
}: ButtonCardProps) {
  return (
    <>
      {state ? (
        <div
          className={`${className} inline-flex h-fit w-fit items-center rounded-md p-2 hover:bg-gray-300 ${editor?.isActive(state) ? 'bg-gray-200/100' : ''}`}
        >
          {children}
        </div>
      ) : (
        <div className="inline-flex h-fit w-fit items-center rounded-md p-2 hover:bg-gray-300">
          {children}
        </div>
      )}
    </>
  )
}
