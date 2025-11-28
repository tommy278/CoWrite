import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import Heading from '@tiptap/extension-heading'
import ButtonCard from './ButtonCard'
import HeaderDropdown from '@/components/HeaderDropdown'
import Highlight from '@tiptap/extension-highlight'
import HighlightDropdown from '@/components/HighlightDropdown'
import { RxDividerVertical } from 'react-icons/rx'
import { extensions } from '@/lib/constants'
import { BulletList, OrderedList } from '@tiptap/extension-list'

import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
} from 'lucide-react'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

interface TiptapProps {
  onChange: (content: any) => void
  value: TiptapJSON
  className?: string
}

function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="mb-2 flex w-full items-center justify-center space-x-2 border-b py-2">
      <ButtonCard editor={editor} state="undo">
        <button onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={20} className="cursor-pointer" />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="redo">
        <button onClick={() => editor.chain().focus().undo().run()}>
          <Redo size={20} className="cursor-pointer" />
        </button>
      </ButtonCard>

      <RxDividerVertical className="h-10" size={40} />

      <ButtonCard editor={editor} state={null}>
        <HeaderDropdown editor={editor} />
      </ButtonCard>

      <ButtonCard state="code" editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`cursor-pointer ${editorState.isCode ? 'is-active' : ''}`}
        >
          <Code size={20} />
        </button>
      </ButtonCard>

      <ButtonCard state="bold" editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`cursor-pointer ${editorState.isBold ? 'is-active' : ''}`}
        >
          <Bold size={20} />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="italic">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`cursor-pointer ${editorState.isItalic ? 'is-active' : ''}`}
        >
          <Italic size={20} />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="underline">
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`cursor-pointer ${editor.isActive('underline') ? 'underline' : ''}`}
        >
          <Underline size={20} />
        </button>
      </ButtonCard>

      <ButtonCard state="strike" editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`cursor-pointer ${editorState.isStrike ? 'is-active' : ''}`}
        >
          <Strikethrough size={20} />
        </button>
      </ButtonCard>

      <RxDividerVertical className="h-10" size={40} />

      <ButtonCard editor={editor} state={null}>
        <HighlightDropdown editor={editor} />
      </ButtonCard>

      <ButtonCard editor={editor} state="bulletList">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`cursor-pointer ${editorState.isBulletList ? 'is-active' : ''}`}
        >
          <List size={20} />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="orderedList">
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`cursor-pointer ${editorState.isOrderedList ? 'is-active' : ''}`}
        >
          <ListOrdered size={20} />
        </button>
      </ButtonCard>
    </div>
  )
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
        className={`prose-editor min-h-screen w-[60%] rounded-md p-5 focus:outline-none ${className}`}
        autoFocus
      />
    </div>
  )
}

export default Tiptap
