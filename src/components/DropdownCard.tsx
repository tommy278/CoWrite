import { ReactNode } from 'react'

export default function DropdownCard({
  children,
  text,
  className,
}: {
  children: ReactNode
  text: string
  className?: string
}) {
  return (
    <span
      className={`flex items-center space-x-1 ${className ? className : ''}`}
    >
      <p className="text-xs">{text}</p>
      {children}
    </span>
  )
}
