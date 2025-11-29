import ButtonCard from '@/components/ButtonCard'
import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { List, ListOrdered } from 'lucide-react'
import { EllipsisVertical } from 'lucide-react'
import { clickDetector } from '@/context/clickDetector'

interface ListDropdownProps {
  editor: Editor
  editorState: any
}

export function ListDropdown({ editor, editorState }: ListDropdownProps) {
  const [listOpen, toggleListOpen] = useState(false)
  const ref = clickDetector(() => toggleListOpen(false))

  return (
    <span ref={ref} className="relative">
      <EllipsisVertical
        className="btn-format cursor-pointer"
        onClick={() => toggleListOpen(!listOpen)}
      />
      {listOpen && (
        <div className="absolute top-0 right-0 mt-7 flex rounded-md bg-gray-400 p-1 shadow-md">
          <ButtonCard editor={editor} state="bulletList">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`cursor-pointer ${editorState.isBulletList ? 'is-active' : ''}`}
            >
              <List className="btn-format" />
            </button>
          </ButtonCard>

          <ButtonCard editor={editor} state="orderedList">
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`cursor-pointer ${editorState.isOrderedList ? 'is-active' : ''}`}
            >
              <ListOrdered className="btn-format" />
            </button>
          </ButtonCard>
        </div>
      )}
    </span>
  )
}
