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
  const relative = !mobile ? 'relative' : ''
  return (
    <div ref={ref} className={relative}>
      <button
        onClick={() => toggleListOpen((prev) => !prev)}
        className="flex cursor-pointer items-center justify-center space-x-1"
      >
        <EllipsisVertical className="btn-format" />
        <MobileText text="List dropdown" />
      </button>

      {listOpen && (
        <div className={mobile ? 'dropdown-child' : 'dropdown-right'}>
          <ButtonCard
            editor={editor}
            state="bulletList"
            text="Bullet list"
            direction="left"
            dropdown
          >
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`parallel ${editorState.isBulletList ? 'is-active' : ''}`}
            >
              <List className="btn-format" />{' '}
              <MobileText text="Bullet list" primary />
            </button>
          </ButtonCard>

          <ButtonCard
            editor={editor}
            state="orderedList"
            text="Ordered list"
            direction="left"
            dropdown
          >
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`parallel ${editorState.isOrderedList ? 'is-active' : ''}`}
            >
              <ListOrdered className="btn-format" />
              <MobileText text="Ordered list" primary />
            </button>
          </ButtonCard>
        </div>
      )}
    </div>
  )
}
