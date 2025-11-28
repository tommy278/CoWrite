import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { FaHighlighter } from 'react-icons/fa6'
import { FaBan } from 'react-icons/fa'

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
  return (
    <div className="mb-1 items-center">
      <div className="flex items-center">
        <FaHighlighter
          size={20}
          className="cursor-pointer"
          onClick={() => toggleHighlightOpen(!highlightOpen)}
        />
      </div>

      {highlightOpen && (
        <div className="inset fixed z-50 mt-2 flex flex-row flex-wrap items-center space-x-2 rounded-md bg-gray-400 p-2 shadow-md">
          {Object.entries(colors).map(([key, color]) => (
            <button
              key={key}
              onClick={() => handleClick(color)}
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${
                editor.isActive('highlight', { color }) ? 'is-active' : ''
              }`}
            >
              <div
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
            </button>
          ))}

          <button
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            disabled={!editor.isActive('highlight')}
            className="flex h-7 w-7 cursor-pointer items-center justify-center"
          >
            <FaBan size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
