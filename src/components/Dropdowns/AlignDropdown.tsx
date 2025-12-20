import { clickDetector } from '@/Hooks/clickDetector'
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
import ButtonCard from '@/components/ButtonCard'

export function AlignDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = clickDetector(() => setIsOpen(false))

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <TextAlignStart className="btn-format" />
      </button>

      {isOpen && (
        <div className="dropdown-right w-fit">
          <ButtonCard
            editor={editor}
            text="Align left"
            direction="right"
            dropdown
          >
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className="parallel justify-between"
            >
              <AlignLeft className="h-5 w-5" />{' '}
              <MobileText text="Align left" primary />
            </button>
          </ButtonCard>

          <ButtonCard
            editor={editor}
            text="Align center"
            direction="right"
            dropdown
          >
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className="parallel"
            >
              <AlignCenter className="h-5 w-5" />
              <MobileText text="Align center" primary />
            </button>
          </ButtonCard>

          <ButtonCard
            editor={editor}
            text="Align right"
            direction="right"
            dropdown
          >
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className="parallel"
            >
              <AlignRight className="h-5 w-5" />
              <MobileText text="Align right" primary />
            </button>
          </ButtonCard>

          <ButtonCard
            text="Align justify"
            editor={editor}
            direction="right"
            dropdown
          >
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
              className="parallel"
            >
              <AlignJustify className="h-5 w-5" />
              <MobileText text="Align justify" primary />
            </button>
          </ButtonCard>
        </div>
      )}
    </div>
  )
}
