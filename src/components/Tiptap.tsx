import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import HardBreak from '@tiptap/extension-hard-break'

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
    extensions: [StarterKit, HardBreak],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none outline-none prose max-w-none min-h-[400px]',
      },
    },
  })

  return (
    <EditorContent
      editor={editor}
      className={`w-[80%] rounded-md border bg-white p-5 focus:outline-none ${className}`}
    />
  )
}

export default Tiptap
