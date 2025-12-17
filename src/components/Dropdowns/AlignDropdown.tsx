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
import MobileText from '../MobileText'

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
        <div className="dropdown w-fit">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="parallel justify-between"
          >
            <MobileText text="Align left" primary />
            <AlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="parallel"
          >
            <MobileText text="Align center" primary />
            <AlignCenter />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="parallel"
          >
            <MobileText text="Align right" primary />
            <AlignRight />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className="parallel"
          >
            <MobileText text="Align justify" primary />
            <AlignJustify />
          </button>
        </div>
      )}
    </div>
  )
}
