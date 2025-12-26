import * as Tooltip from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'

export default function ToolTip({
  children,
  text,
  dropdownChild,
  direction,
}: {
  children: ReactNode
  text: string
  dropdownChild?: boolean
  direction?: 'top' | 'bottom' | 'right' | 'left'
}) {
  return (
    <Tooltip.Root>
      {!dropdownChild ? (
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      ) : (
        <Tooltip.Trigger asChild>
          <div className="hover:bg-hover-bg flex flex-row items-center rounded-md p-1 text-xs md:p-2 md:text-sm">
            {children}
          </div>
        </Tooltip.Trigger>
      )}
      <Tooltip.Content
        side={direction ?? 'bottom'}
        align="center"
        className="m-2 rounded bg-gray-800 px-2 py-1 text-xs text-white"
      >
        {text}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
