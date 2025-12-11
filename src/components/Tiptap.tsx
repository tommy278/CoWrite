import { EditorContent, useEditor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import { extensions } from '@/lib/Constants/constants'
import { BulletList, OrderedList } from '@tiptap/extension-list'
import MenuBar from '@/components/Headers/Menubar'
import type { JSONContent } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'

interface TiptapProps {
  onChange?: (content: JSONContent) => void
  value: JSONContent
  className?: string
  editable: boolean
}

const Tiptap = ({ value, className, onChange, editable }: TiptapProps) => {
  const lowlight = createLowlight()
  lowlight.register('js', javascript)
  lowlight.register('python', python)

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
      Link.configure({
        openOnClick: true,
        autolink: true,
        enableClickSelection: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
      }),
      HorizontalRule,
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
        defaultLanguage: 'plaintext',
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

  if (!editor) {
    console.log()
    return <div>Something went wrong</div>
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <MenuBar editor={editor} editable={editable} />
      <EditorContent
        editor={editor}
        className={`prose-editor h-full min-h-screen w-[70%] border-x border-gray-200 px-5 py-10 focus:outline-none ${className}`}
        autoFocus
      />
    </div>
  )
}

export default Tiptap
