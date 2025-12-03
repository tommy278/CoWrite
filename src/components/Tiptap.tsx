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

interface TiptapProps {
  onChange: (content: JSONContent) => void
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
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none outline-none prose w-full',
      },
    },
  })
  interface ConfirmModalProps {
    type: 'delete' | 'confirmDelete' | 'restore' | ''
    serverFn: () => Promise<void>
  }
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<
    'delete' | 'confirmDelete' | 'restore' | null
  >(null)

  function ConfirmModal({ type, serverFn }: ConfirmModalProps) {
    return (
      <div>
        {type === 'delete' && (
          <p>
            This document will be deleted from all documents. It will be in
            recently deleted for 30 days
          </p>
        )}
        {type === 'confirmDelete' && <p>This document will deleted forever</p>}
        {type === 'restore' && <p>Recover document</p>}
        <button
          onClick={async () => await serverFn()}
          className="cursor-pointer"
        >
          {type}
        </button>
      </div>
    )
  }

  const serverFunctions = {
    delete: async () => softDeleteFn({ data: { id } }),
    confirmDelete: async () => hardDeleteFn({ data: { id } }),
    restore: async () => restoreDocumentFn({ data: { id } }),
  }

  if (!editor) {
    return <div>Something went wrong</div>
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <MenuBar editor={editor} />
      <div className="mx-[15%] flex self-end">
        {!editable ? (
          <>
            <button
              className="mr-5 cursor-pointer"
              onClick={() => setType('confirmDelete')}
            >
              Delete
            </button>
            <button
              className="cursor-pointer"
              onClick={() => setType('restore')}
            >
              Restore
            </button>
          </>
        ) : (
          <button onClick={() => setType('delete')} className="cursor-pointer">
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
