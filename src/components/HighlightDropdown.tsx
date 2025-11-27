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
        <div className="inset fixed z-50 mt-2 flex items-center space-x-2 rounded-md bg-gray-400 px-2 shadow-md">
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
