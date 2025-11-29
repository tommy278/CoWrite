import { EditorContent, useEditor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import { extensions } from '@/lib/constants'
import { BulletList, OrderedList } from '@tiptap/extension-list'
import MenuBar from '@/components/Headers/Menubar'
import type { JSONContent } from '@tiptap/core'

interface TiptapProps {
  onChange: (content: JSONContent) => void
  value: JSONContent
  className?: string
}

const Tiptap = ({ value, className, onChange }: TiptapProps) => {
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
      <EditorContent
        editor={editor}
        className={`prose-editor min-h-screen w-[70%] rounded-md bg-gray-200 p-5 focus:outline-none ${className}`}
        autoFocus
      />
    </div>
  )
}

export default Tiptap
