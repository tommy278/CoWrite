import { clickDetector } from '@/context/clickDetector'
import type { Editor } from '@tiptap/react'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  TextAlignStart,
} from 'lucide-react'
import { useState } from 'react'

export function AlignDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = clickDetector(() => setIsOpen(false))

  return (
    <div ref={ref} className="flex items-center">
      <button
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <TextAlignStart className="btn-format" />
      </button>

      {isOpen && (
        <div className="dropdown">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify />
          </button>
        </div>
      )}
    </div>
  )
}
