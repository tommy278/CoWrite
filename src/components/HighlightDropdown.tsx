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
    <div>
      <div className="flex items-center">
        <FaHighlighter onClick={() => toggleHighlightOpen(!highlightOpen)} />
      </div>

      {highlightOpen && (
        <div className="inset fixed z-50 flex space-x-2">
          {Object.entries(colors).map(([key, color]) => (
            <div key={key}>
              <button
                onClick={() => handleClick(color)}
                className={
                  editor.isActive('highlight', { color }) ? 'is-active' : ''
                }
              >
                <div
                  className="mt-2 h-5 w-5 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
              </button>
            </div>
          ))}
          <button
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            disabled={!editor.isActive('highlight')}
          >
            <FaBan />
          </button>
        </div>
      )}
    </div>
  )
}
