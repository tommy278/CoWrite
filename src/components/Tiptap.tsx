import { EditorContent, useEditor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import { extensions } from '@/lib/Constants/constants'
import { BulletList, OrderedList } from '@tiptap/extension-list'
import MenuBar from '@/components/Headers/Menubar'
import type { JSONContent } from '@tiptap/core'
import { softDeleteFn } from '@/lib/serverFunctions/DELETE/softDeleteFn'

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

  if (!editor) {
    return <div>Something went wrong</div>
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <MenuBar editor={editor} />
      <div className="mx-[15%] flex self-end">
        {!editable ? (
          <>
            <button className="cursor-pointer">Delete</button>
            <button className="cursor-pointer">Restore</button>
          </>
        ) : (
          <button
            onClick={async () => softDeleteFn({ data: { id } })}
            className="cursor-pointer"
          >
            Delete
          </button>
        )}
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
