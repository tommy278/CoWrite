import * as Tooltip from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'

export default function ToolTip({
  children,
  text,
}: {
  children: ReactNode
  text: string
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
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
