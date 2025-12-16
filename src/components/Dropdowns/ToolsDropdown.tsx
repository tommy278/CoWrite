import type { Editor } from '@tiptap/react'
import LargeDropdown from './LargeDropdown'
import ButtonCard from '../ButtonCard'
import TableDropdown from './TableDropdown'
import { CodeXml, Link2Off, SquareMinus, TextQuote } from 'lucide-react'
import LinkPopover from './LinkPopover'
import { ListDropdown } from './ListDropdown'
import CountsDropdown from './CountsDropdown'
import DropdownCard from '../DropdownCard'

interface Counts {
  characters: number
  words: number
}

export default function ToolsDropdown({
  editor,
  editorState,
  counts,
}: {
  editor: Editor
  editorState: any
  counts: Counts
}) {
  return (
    <LargeDropdown text="Tools">
      <ButtonCard editor={editor} state="codeBlock" text="Toggle code block">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editorState.canCodeBlock}
          className={`cursor-pointer ${editorState.isCodeBlock ? 'is-active' : ''}`}
        >
          <DropdownCard text="Code block">
            <CodeXml className="btn-format" />
          </DropdownCard>
        </button>
      </ButtonCard>
      <ButtonCard editor={editor} state="blockQuote" text="Toggle block-quote">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editorState.canBlockQuote}
          className={`cursor-pointer ${editorState.isBlockQuote ? 'is-active' : ''}`}
        >
          <DropdownCard text="Blockquote">
            <TextQuote className="btn-format" />
          </DropdownCard>
        </button>
      </ButtonCard>
      <ButtonCard editor={editor} text="Open List dropdown">
        <DropdownCard text="Bullet/Ordered List">
          <ListDropdown editor={editor} editorState={editorState} />
        </DropdownCard>
      </ButtonCard>

      <ButtonCard editor={editor} text="Set Horizontal Rule">
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <DropdownCard text="Horizontal rule">
            <SquareMinus className="btn-format cursor-pointer" />
          </DropdownCard>
        </button>
      </ButtonCard>
      <ButtonCard editor={editor} text="Toggle Word / Character Count">
        <DropdownCard text="Word/Character count">
          <CountsDropdown counts={counts} />
        </DropdownCard>
      </ButtonCard>
    </LargeDropdown>
  )
}
