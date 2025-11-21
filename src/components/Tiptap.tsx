import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import HardBreak from '@tiptap/extension-hard-break'
import ButtonCard from './ButtonCard'
import { ReactNode } from 'react'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

interface TiptapProps {
  onChange: (content: any) => void
  value: TiptapJSON
  className?: string
  children: ReactNode
}

const Tiptap = ({ value, className, onChange, children }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit, HardBreak],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none outline-none prose min-h-[400px]',
      },
    },
  })

  if (!editor) {
    return <div>Something went wrong</div>
  }

  return (
    <div className="flex w-[80%] flex-col items-center justify-center">
      <div className="flex justify-between space-x-5">
        <button onClick={() => editor.chain().focus().undo().run()}>
          <span>Undo</span>
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          <span>Redo</span>
        </button>

        <ButtonCard editor={editor} state="bold">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'font-bold' : ''}
          >
            <span className="font-bold">B</span>
          </button>
        </ButtonCard>

        <ButtonCard editor={editor} state="italic">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'italic' : ''}
          >
            <span className="italic">I</span>
          </button>
        </ButtonCard>

        <ButtonCard editor={editor} state="underline">
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'underline' : ''}
          >
            <span className="underline">U</span>
          </button>
        </ButtonCard>
        <ButtonCard editor={editor} state="strike-through">
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike-through') ? 'line-through' : ''}
          >
            <span className="line-through">S</span>
          </button>
        </ButtonCard>
        <div>{children}</div>
      </div>
      <EditorContent
        editor={editor}
        className={`rounded-md border bg-white p-5 focus:outline-none ${className}`}
      />
    </div>
  )
}

export default Tiptap
