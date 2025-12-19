import { clickDetector } from '@/context/clickDetector'
import { ReactNode, useState } from 'react'

export default function LargeDropdown({
  children,
  text,
  className,
}: {
  children: ReactNode
  text: 'Tools' | 'Insert'
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = clickDetector(() => setIsOpen(false))
  return (
    <div
      className={`flex items-center md:hidden ${className ? className : ''}`}
      ref={ref}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        <p className="text-xs">{text}</p>
      </button>
      {isOpen && <div className="dropdown flex flex-col">{children}</div>}
    </div>
  )
}
