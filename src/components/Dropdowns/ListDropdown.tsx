import ButtonCard from '@/components/ButtonCard'
import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { List, ListOrdered } from 'lucide-react'
import { EllipsisVertical } from 'lucide-react'
import { clickDetector } from '@/context/clickDetector'
import MobileText from '../MobileText'

interface ListDropdownProps {
  editor: Editor
  editorState: any
  mobile?: boolean
}

export function ListDropdown({
  editor,
  editorState,
  mobile,
}: ListDropdownProps) {
  const [listOpen, toggleListOpen] = useState(false)
  const ref = clickDetector(() => toggleListOpen(false))

  return (
    <div ref={ref}>
      <button
        onClick={() => toggleListOpen((prev) => !prev)}
        className="parallel cursor-pointer"
      >
        <MobileText text="List dropdown" />
        <EllipsisVertical className="btn-format" />
      </button>

      {listOpen && (
        <div className={mobile ? 'dropdown-child' : 'dropdown'}>
          <ButtonCard editor={editor} state="bulletList">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`parallel ${editorState.isBulletList ? 'is-active' : ''}`}
            >
              <MobileText text="Bullet list" primary />
              <List className="btn-format" />
            </button>
          </ButtonCard>

          <ButtonCard editor={editor} state="orderedList">
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`parallel ${editorState.isOrderedList ? 'is-active' : ''}`}
            >
              <MobileText text="Ordered list" primary />
              <ListOrdered className="btn-format" />
            </button>
          </ButtonCard>
        </div>
      )}
    </div>
  )
}
