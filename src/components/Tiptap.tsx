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
import { useMemo, useState, useEffect } from 'react'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { useHeaderHeight } from '@/Hooks/useHeaderHeight'
import DocumentLoader from './SkeletonLoader/DocumentLoader'

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
  display?: boolean
}

export default function Tiptap({
  value,
  className,
  onChange,
  editable,
  display,
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
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ]
  }, [])

  interface CountProps {
    characters: number
    words: number
  }
  const [counts, setCounts] = useState<CountProps>({ characters: 0, words: 0 })
  const editor = useEditor({
    extensions,
    editable,
    content: value,
    autofocus: false,
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      editor.commands.focus('end')
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
      setCounts({
        characters: editor.storage.characterCount.characters(),
        words: editor.storage.characterCount.words(),
      })
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none outline-none prose w-full',
      },
    },
  })
  useEffect(() => {
    if (!editor) return
    setCounts({
      characters: editor.storage.characterCount.characters(),
      words: editor.storage.characterCount.words(),
    })
  }, [editor])

  useHeaderHeight()

  if (!editor) return <DocumentLoader />
  const editorClass = `prose-editor 
  ${!display ? 'w-[70%] min-h-screen border-x dark:border-gray-500 border-gray-200 px-2 py-5 sm:px-4 sm:py-7 md:px-6 md:py-10 mx-auto' : 'time-size px-0.5 py-1 md:px-1 md:py-2'} 
  ${className}`
  return (
    <>
      {!display && editable && <MenuBar editor={editor} counts={counts} />}
      <EditorContent editor={editor} className={editorClass} />
    </>
  )
}
