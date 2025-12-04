import { EditorContent, useEditor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import { extensions } from '@/lib/Constants/constants'
import { BulletList, OrderedList } from '@tiptap/extension-list'
import MenuBar from '@/components/Headers/Menubar'
import type { JSONContent } from '@tiptap/core'
import { softDeleteFn } from '@/lib/serverFunctions/DELETE/softDeleteFn'
import { useState } from 'react'
import { hardDeleteFn } from '@/lib/serverFunctions/DELETE/hardDeleteFn'
import { restoreDocumentFn } from '@/lib/serverFunctions/UPDATE/restoreDocument'
import ConfirmModal from './Dropdowns/ConfirmModal'
import { clickDetector } from '@/context/clickDetector'
import { useNavigate } from '@tanstack/react-router'

interface TiptapProps {
  onChange?: (content: JSONContent) => void
  value: JSONContent
  className?: string
  id: string
  editable: boolean
}

const Tiptap = ({ value, className, onChange, id, editable }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      ...extensions,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Highlight.configure({ multicolor: true }),
      BulletList.configure({
        HTMLAttributes: { class: 'list-disc ml-2' },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: 'list-decimal ml-2' },
      }),
    ],
    editable,
    content: value,
    immediatelyRender: false,
    autofocus: true,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none outline-none prose w-full',
      },
    },
  })
  const navigate = useNavigate()
  const [type, setType] = useState<'delete' | 'confirmDelete' | 'restore' | ''>(
    ''
  )
  const ref = clickDetector(() => setType(''))

  const serverFunctions = {
    delete: async () => {
      await softDeleteFn({ data: { id } })
      setType('')
      navigate({ to: '/dashboard/documents' })
    },
    confirmDelete: async () => {
      await hardDeleteFn({ data: { id } })
      setType('')
      navigate({ to: '/dashboard/documents' })
    },
    restore: async () => {
      await restoreDocumentFn({ data: { id } })
      setType('')
      navigate({
        to: '/dashboard/document/$doc_id',
        params: { doc_id: id },
      })
    },
  }

  if (!editor) {
    return <div>Something went wrong</div>
  }

  const toggleType = (type: 'delete' | 'confirmDelete' | 'restore' | '') => {
    setType((prev) => (prev === type ? '' : type))
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <MenuBar editor={editor} editable={editable} />
      <div className="relative mx-[15%] flex self-end" ref={ref}>
        {!editable ? (
          <>
            <button
              className="mr-5 cursor-pointer"
              onClick={() => toggleType('confirmDelete')}
            >
              Delete
            </button>
            <button
              className="cursor-pointer"
              onClick={() => toggleType('restore')}
            >
              Restore
            </button>
          </>
        ) : (
          <button
            onClick={() => toggleType('delete')}
            className="cursor-pointer"
          >
            Delete
          </button>
        )}
        {type && <ConfirmModal type={type} serverFn={serverFunctions[type]} />}
      </div>
      <EditorContent
        editor={editor}
        className={`prose-editor min-h-screen w-[70%] rounded-md bg-gray-200 p-5 focus:outline-none ${className}`}
        autoFocus
      />
    </div>
  )
}

export default Tiptap
