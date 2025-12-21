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
          <div className="flex flex-row items-center rounded-md p-1 text-xs hover:bg-gray-100 md:p-2 md:text-sm dark:hover:bg-gray-700">
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
