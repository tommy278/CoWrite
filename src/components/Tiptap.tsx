import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

interface TiptapProps {
  onChange: (content: any) => void
  value: TiptapJSON
  className?: string
}

const Tiptap = ({ value, className, onChange }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  return (
    <EditorContent
      editor={editor}
      className={`min-h-[300px] rounded-md border border-gray-300 bg-white p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${className}`}
    />
  )
}

export default Tiptap
