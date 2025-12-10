import { useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import ButtonCard from '../ButtonCard'
import HeaderDropdown from '@/components/Dropdowns/HeaderDropdown'
import HighlightDropdown from '@/components/Dropdowns/HighlightDropdown'
import { RxDividerVertical } from 'react-icons/rx'
import { ListDropdown } from '@/components/Dropdowns/ListDropdown'

import {
  Bold,
  Strikethrough,
  Italic,
  Underline,
  // Quote, Will be added later
  Undo,
  Redo,
  Code,
} from 'lucide-react'

export default function MenuBar({
  editor,
  editable,
}: {
  editor: Editor
  editable: boolean
}) {
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
        isLink: ctx.editor.isActive('link') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // If user cleared the link
    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  return (
    <div
      className={`sticky ${editable ? 'top-[78px]' : 'top-76px'} z-40 flex w-full items-center justify-start space-x-1 bg-gray-200 py-2`}
    >
      <ButtonCard editor={editor} state="undo" className="ml-3 md:ml-5">
        <button onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="btn-format cursor-pointer" />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="redo">
        <button onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="btn-format cursor-pointer" />
        </button>
      </ButtonCard>

      {/* <RxDividerVertical className="hidden md:block md:h-10 md:w-10" /> */}

      <ButtonCard editor={editor} state={null}>
        <HeaderDropdown editor={editor} />
      </ButtonCard>

      <ButtonCard state="code" editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`cursor-pointer ${editorState.isCode ? 'is-active' : ''}`}
        >
          <Code className="btn-format" />
        </button>
      </ButtonCard>

      <ButtonCard state="bold" editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`cursor-pointer ${editorState.isBold ? 'is-active' : ''}`}
        >
          <Bold className="btn-format" />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="italic">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`cursor-pointer ${editorState.isItalic ? 'is-active' : ''}`}
        >
          <Italic className="btn-format" />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} state="underline">
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`cursor-pointer ${editor.isActive('underline') ? 'underline' : ''}`}
        >
          <Underline className="btn-format" />
        </button>
      </ButtonCard>

      <ButtonCard state="strike" editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`cursor-pointer ${editorState.isStrike ? 'is-active' : ''}`}
        >
          <Strikethrough className="btn-format" />
        </button>
      </ButtonCard>

      {/* <RxDividerVertical className="hidden md:block md:h-10 md:w-10" /> */}

      <ButtonCard editor={editor} state={null}>
        <HighlightDropdown editor={editor} />
      </ButtonCard>

      <ButtonCard editor={editor} state={'link'}>
        <button
          onClick={setLink}
          className={editorState.isLink ? 'is-active' : ''}
        >
          Set link
        </button>
      </ButtonCard>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editorState.isLink}
      >
        Unset link
      </button>

      <span className="mr-5">
        <ButtonCard editor={editor} state={null}>
          <ListDropdown editor={editor} editorState={editorState} />
        </ButtonCard>
      </span>
    </div>
  )
}
