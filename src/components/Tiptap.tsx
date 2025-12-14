import { EditorContent, useEditor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import { extensions as baseExtensions } from '@/lib/Constants/constants'
import { BulletList, OrderedList } from '@tiptap/extension-list'
import MenuBar from '@/components/Headers/Menubar'
import type { JSONContent } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import { Dropcursor } from '@tiptap/extensions'
import Image from '@tiptap/extension-image'
import { useMemo } from 'react'
import { TableKit } from '@tiptap/extension-table'

const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.registerAlias('javascript', ['js'])
lowlight.register('typescript', typescript)
lowlight.registerAlias('typescript', ['ts'])
lowlight.register('python', python)

interface TiptapProps {
  onChange?: (content: JSONContent) => void
  value: JSONContent
  className?: string
  editable: boolean
}

export default function Tiptap({
  value,
  className,
  onChange,
  editable,
}: TiptapProps) {
  const extensions = useMemo(() => {
    return [
      ...baseExtensions,
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
      }),

      HorizontalRule,
      Image.configure({
        resize: {
          enabled: true,
          directions: ['top', 'bottom', 'left', 'right'],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        },
      }),
      Dropcursor,
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: 'language-',
        defaultLanguage: 'plaintext',
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
    ]
  }, [])
  const editor = useEditor({
    extensions,
    editable,
    content: value,
    autofocus: true,
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none outline-none prose w-full',
      },
    },
  })

  if (!editor) return <div>Loading...</div>

  return (
    <div className="relative flex flex-col items-center justify-center">
      <MenuBar editor={editor} editable={editable} />
      <EditorContent
        editor={editor}
        className={`prose-editor h-full min-h-screen w-[70%] border-x border-gray-200 px-5 py-10 ${className}`}
      />
    </div>
  )
}
