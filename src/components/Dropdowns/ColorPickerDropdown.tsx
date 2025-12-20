import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { Highlighter, Baseline } from 'lucide-react'
import { FaBan } from 'react-icons/fa'
import { clickDetector } from '@/Hooks/clickDetector'

const colors = {
  orange: '#ffc078',
  green: '#8ce99a',
  blue: '#74c0fc',
  purple: '#b197fc',
  red: '#ffa8a8',
  yellow: '#ffec99',
  teal: '#63e6be',
  pink: '#faa2c1',
  indigo: '#91a7ff',
  lime: '#c0eb75',
  cyan: '#99e9f2',
}

type Mode = 'highlight' | 'color'

const MODE_CONFIG = {
  highlight: {
    icon: Highlighter,
    apply: (editor: Editor, color: string) =>
      editor.chain().focus().toggleHighlight({ color }).run(),
    unset: (editor: Editor) => editor.chain().focus().unsetHighlight().run(),
    isActive: (editor: Editor, color: string) =>
      editor.isActive('highlight', { color }),
  },
  color: {
    icon: Baseline,
    apply: (editor: Editor, color: string) =>
      editor.chain().focus().setColor(color).run(),
    unset: (editor: Editor) => editor.chain().focus().unsetColor().run(),
    isActive: (editor: Editor, color: string) =>
      editor.isActive('textStyle', { color }),
  },
}

export default function ColorPicker({
  editor,
  mode,
}: {
  editor: Editor
  mode: Mode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = clickDetector(() => setIsOpen(false))

  const config = MODE_CONFIG[mode]
  const Icon = config.icon

  return (
    <div ref={ref}>
      <Icon
        className="btn-format cursor-pointer"
        onClick={() => setIsOpen((p) => !p)}
      />

      {isOpen && (
        <div className="dropdown end-0 md:end-auto md:min-w-[150px]">
          <div className="flex items-center space-x-2 md:grid md:grid-cols-4 md:space-x-0">
            {Object.entries(colors).map(([key, color]) => (
              <button
                key={key}
                onClick={() => {
                  config.apply(editor, color)
                  setIsOpen(false)
                }}
                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full md:h-7 md:w-7 ${
                  config.isActive(editor, color) ? 'is-active' : ''
                }`}
              >
                <div
                  className="h-3 w-3 rounded-full md:h-5 md:w-5"
                  style={{ backgroundColor: color }}
                />
              </button>
            ))}

            <button
              onClick={() => config.unset(editor)}
              className="flex h-7 w-7 items-center justify-center"
            >
              <FaBan className="h-3 w-3 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
