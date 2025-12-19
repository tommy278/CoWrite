import { useEditor } from '@/lib/Constants/editorState'
import type { Editor } from '@tiptap/react'
import ButtonCard from '../ButtonCard'
import HeaderDropdown from '@/components/Dropdowns/HeaderDropdown'
import ColorPicker from '@/components/Dropdowns/ColorPickerDropdown'
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
import ToolsDropdown from '../Dropdowns/ToolsDropdown'
import InsertDropdown from '../Dropdowns/InsertDropdown'

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
  const editorState = useEditor(editor)
  const Divider = () => (
    <div className="hidden h-5 w-px shrink-0 bg-gray-500 md:block md:h-8" />
  )
  return (
    <menu
      className={`sticky ${editable ? 'top-[78px]' : 'top-76px'} z-40 flex w-full items-center justify-between border-b border-gray-300 bg-gray-200 px-0.5 py-2 sm:px-6 md:px-10`}
      aria-label="Editor toolbar"
    >
      <Tooltip.Provider delayDuration={200}>
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

        <Divider />

        <ButtonCard className="md:hidden">
          <InsertDropdown editor={editor} editorState={editorState} />
        </ButtonCard>

        <ButtonCard className="md:hidden">
          <ToolsDropdown
            editor={editor}
            editorState={editorState}
            counts={counts}
          />
        </ButtonCard>
        <ButtonCard editor={editor} text="Open Table dropdown" mobileDisplay>
          <TableDropdown editor={editor} />
        </ButtonCard>

        <Divider />
        <ButtonCard editor={editor} text="Header dropdown">
          <HeaderDropdown editor={editor} />
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
          state="blockquote"
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

        <ButtonCard editor={editor} text="Open List dropdown" mobileDisplay>
          <ListDropdown editor={editor} editorState={editorState} />
        </ButtonCard>

        <ButtonCard editor={editor} text="Open Align dropdown">
          <AlignDropdown editor={editor} />
        </ButtonCard>

        <Divider />

        <ButtonCard editor={editor} text="Set Horizontal Rule" mobileDisplay>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <SquareMinus className="btn-format cursor-pointer" />
          </button>
        </ButtonCard>

        <ButtonCard editor={editor} mobileDisplay>
          <CountsDropdown counts={counts} />
        </ButtonCard>
      </Tooltip.Provider>
    </menu>
  )
}
