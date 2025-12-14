import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { Highlighter } from 'lucide-react'
import { FaBan } from 'react-icons/fa'
import { clickDetector } from '@/context/clickDetector'

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
  magenta: '#da77f2',
  brown: '#eebfaa',
}

export default function ({ editor }: { editor: Editor }) {
  const [highlightOpen, toggleHighlightOpen] = useState(false)

  const handleClick = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run()
    toggleHighlightOpen(false)
  }

  const ref = clickDetector(() => toggleHighlightOpen(false))

  return (
    <div ref={ref}>
      <div className="flex items-center">
        <Highlighter
          className="btn-format cursor-pointer"
          onClick={() => toggleHighlightOpen(!highlightOpen)}
        />
      </div>

      {highlightOpen && (
        <div className="dropdown shadow-md md:min-w-[150px]">
          <div className="flex items-center space-x-2 md:grid md:grid-cols-4 md:space-x-0">
            {Object.entries(colors).map(([key, color]) => (
              <button
                key={key}
                onClick={() => handleClick(color)}
                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full md:h-7 md:w-7 ${
                  editor.isActive('highlight', { color }) ? 'is-active' : ''
                }`}
              >
                <div
                  className="h-3 w-3 rounded-full md:h-5 md:w-5"
                  style={{ backgroundColor: color }}
                />
              </button>
            ))}

            <button
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              disabled={!editor.isActive('highlight')}
              className="flex h-7 w-7 cursor-pointer items-center justify-center"
            >
              <FaBan className="h-3 w-3 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
