import { useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import ButtonCard from '../ButtonCard'
import HeaderDropdown from '@/components/Dropdowns/HeaderDropdown'
import ColorPicker from '@/components/Dropdowns/ColorPickerDropdown'
import { RxDividerVertical } from 'react-icons/rx'
import { ListDropdown } from '@/components/Dropdowns/ListDropdown'
import LinkPopover from '@/components/Dropdowns/LinkPopover'
import * as Tooltip from '@radix-ui/react-tooltip'

import {
  Bold,
  Strikethrough,
  Italic,
  Underline,
  Undo,
  Redo,
  Code,
  CodeXml,
  Link2Off,
  SquareMinus,
  TextQuote,
} from 'lucide-react'
import TableDropdown from '../Dropdowns/TableDropdown'
import { AlignDropdown } from '../Dropdowns/AlignDropdown'
import CountsDropdown from '../Dropdowns/CountsDropdown'
import LargeDropdown from '../Dropdowns/LargeDropdown'
import ToolsDropdown from '../Dropdowns/ToolsDropdown'
import DropdownCard from '../DropdownCard'

interface Counts {
  characters: number
  words: number
}

export default function MenuBar({
  editor,
  editable,
  counts,
}: {
  editor: Editor
  editable: boolean
  counts: Counts
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
        canCodeBlock: ctx.editor.can().chain().toggleCodeBlock().run() ?? false,
        isBlockQuote: ctx.editor.isActive('blockQuote') ?? false,
        canBlockQuote:
          ctx.editor.can().chain().toggleBlockquote().run() ?? false,
        isLink: ctx.editor.isActive('link') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })
  const Divider = () => (
    <RxDividerVertical className="hidden h-10 w-10 md:block" color="gray" />
  )

  return (
    <menu
      className={`sticky ${editable ? 'top-[78px]' : 'top-76px'} z-40 flex w-full items-center justify-between space-x-2 border-b border-gray-300 bg-gray-200 px-1 py-2 md:space-x-1 md:px-5`}
      aria-label="Editor toolbar"
    >
      <Tooltip.Provider delayDuration={200}>
        <Divider />
        <ButtonCard editor={editor} state="undo" text="Undo Button">
          <button onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="btn-format cursor-pointer" />
          </button>
        </ButtonCard>

        <ButtonCard editor={editor} state="redo" text="Redo Button">
          <button onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="btn-format cursor-pointer" />
          </button>
        </ButtonCard>

        <LargeDropdown text="Insert">
          <ButtonCard editor={editor} text="Open Table dropdown">
            <DropdownCard text="Open Table" className="space-x-1">
              <TableDropdown editor={editor} mobile />
            </DropdownCard>
          </ButtonCard>
          <ButtonCard editor={editor} state={'link'} text="Toggle link">
            <>
              {!editorState.isLink ? (
                <DropdownCard text="Open link" className="space-x-1">
                  <LinkPopover type="link" editor={editor} mobile />
                </DropdownCard>
              ) : (
                <button
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  disabled={!editorState.isLink}
                >
                  <Link2Off className="btn-format" />
                </button>
              )}
            </>
          </ButtonCard>

          <ButtonCard editor={editor} text="Open Image dropdown">
            <DropdownCard text="Image link" className="space-x-1">
              <LinkPopover editor={editor} type="image" mobile />
            </DropdownCard>
          </ButtonCard>
          <ButtonCard editor={editor} text="Open Youtube dropdown">
            <DropdownCard className="space-x-1" text="Youtube link">
              <LinkPopover editor={editor} type="youtube" mobile />
            </DropdownCard>
          </ButtonCard>
        </LargeDropdown>

        <ToolsDropdown
          editor={editor}
          editorState={editorState}
          counts={counts}
        />
        <Divider />

        <ButtonCard editor={editor} text="Header dropdown">
          <HeaderDropdown editor={editor} />
        </ButtonCard>

        <ButtonCard editor={editor} text="Open Table dropdown" mobileDisplay>
          <TableDropdown editor={editor} />
        </ButtonCard>

        <Divider />

        <ButtonCard editor={editor} text="Open Highlight dropdown">
          <ColorPicker editor={editor} mode="highlight" />
        </ButtonCard>

        <ButtonCard editor={editor} text="Open Text-Color dropdown">
          <ColorPicker editor={editor} mode="color" />
        </ButtonCard>

        <Divider />

        <ButtonCard state="code" editor={editor} text="Toggle code text">
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editorState.canCode}
            className={`cursor-pointer ${editorState.isCode ? 'is-active' : ''}`}
          >
            <Code className="btn-format" />
          </button>
        </ButtonCard>

        <ButtonCard state="bold" editor={editor} text="Toggle bold text">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            className={`cursor-pointer ${editorState.isBold ? 'is-active' : ''}`}
          >
            <Bold className="btn-format" />
          </button>
        </ButtonCard>

        <ButtonCard editor={editor} state="italic" text="Toggle italic text">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            className={`cursor-pointer ${editorState.isItalic ? 'is-active' : ''}`}
          >
            <Italic className="btn-format" />
          </button>
        </ButtonCard>

        <ButtonCard
          editor={editor}
          state="underline"
          text="Toggle underline text"
        >
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`cursor-pointer ${editor.isActive('underline') ? 'underline' : ''}`}
          >
            <Underline className="btn-format" />
          </button>
        </ButtonCard>

        <ButtonCard state="strike" editor={editor} text="Toggle strike text">
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            className={`cursor-pointer ${editorState.isStrike ? 'is-active' : ''}`}
          >
            <Strikethrough className="btn-format" />
          </button>
        </ButtonCard>

        <Divider />

        <ButtonCard
          editor={editor}
          state="codeBlock"
          text="Toggle code block"
          mobileDisplay
        >
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editorState.canCodeBlock}
            className={`cursor-pointer ${editorState.isCodeBlock ? 'is-active' : ''}`}
          >
            <CodeXml className="btn-format" />
          </button>
        </ButtonCard>

        <ButtonCard
          editor={editor}
          state="blockQuote"
          text="Toggle block-quote"
          mobileDisplay
        >
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editorState.canBlockQuote}
            className={`cursor-pointer ${editorState.isBlockQuote ? 'is-active' : ''}`}
          >
            <TextQuote className="btn-format" />
          </button>
        </ButtonCard>

        <Divider />

        <ButtonCard editor={editor} text="Open Image dropdown" mobileDisplay>
          <LinkPopover editor={editor} type="image" />
        </ButtonCard>

        <ButtonCard editor={editor} text="Open Youtube dropdown" mobileDisplay>
          <LinkPopover editor={editor} type="youtube" />
        </ButtonCard>

        <ButtonCard
          editor={editor}
          state={'link'}
          text="Toggle link"
          mobileDisplay
        >
          <>
            {!editorState.isLink ? (
              <LinkPopover type="link" editor={editor} />
            ) : (
              <button
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editorState.isLink}
              >
                <Link2Off className="btn-format" />
              </button>
            )}
          </>
        </ButtonCard>

        <Divider />

        <ButtonCard editor={editor} text="Open Align dropdown">
          <AlignDropdown editor={editor} />
        </ButtonCard>

        <ButtonCard editor={editor} text="Open List dropdown" mobileDisplay>
          <ListDropdown editor={editor} editorState={editorState} />
        </ButtonCard>
        <Divider />

        <ButtonCard editor={editor} text="Set Horizontal Rule" mobileDisplay>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <SquareMinus className="btn-format cursor-pointer" />
          </button>
        </ButtonCard>

        <Divider />

        <ButtonCard
          editor={editor}
          text="Toggle Word / Character Count"
          mobileDisplay
        >
          <CountsDropdown counts={counts} />
        </ButtonCard>

        <Divider />
      </Tooltip.Provider>
    </menu>
  )
}
