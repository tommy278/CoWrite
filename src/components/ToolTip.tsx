import * as Tooltip from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'

export default function ToolTip({
  children,
  text,
  dropdownChild,
}: {
  children: ReactNode
  text: string
  dropdownChild?: boolean
}) {
  return (
    <Tooltip.Root>
      {!dropdownChild ? (
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      ) : (
        <Tooltip.Trigger asChild>
          <span className="flex w-full items-center">{children}</span>
        </Tooltip.Trigger>
      )}
      <Tooltip.Content
        side="bottom"
        align="center"
        className="mt-2 rounded bg-gray-800 px-2 py-1 text-xs text-white"
      >
        {text}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
