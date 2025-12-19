import type { Editor } from '@tiptap/react'
import LargeDropdown from './LargeDropdown'
import ButtonCard from '../ButtonCard'
import { CodeXml, SquareMinus, TextQuote } from 'lucide-react'
import CountsDropdown from './CountsDropdown'
import MobileText from '../MobileText'

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
      <ButtonCard
        editor={editor}
        state="codeBlock"
        text="Toggle code block"
        direction="right"
        dropdown
      >
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editorState.canCodeBlock}
          className={`parallel cursor-pointer ${editorState.isCodeBlock ? 'is-active' : ''}`}
        >
          <CodeXml className="btn-format" />
          <MobileText text="Code block" />
        </button>
      </ButtonCard>
      <ButtonCard
        editor={editor}
        state="blockQuote"
        text="Toggle block-quote"
        direction="right"
        dropdown
      >
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editorState.canBlockQuote}
          className={`parallel cursor-pointer ${editorState.isBlockQuote ? 'is-active' : ''}`}
        >
          <TextQuote className="btn-format" />
          <MobileText text="Block quote" />
        </button>
      </ButtonCard>

      <ButtonCard
        editor={editor}
        text="Set Horizontal Rule"
        direction="right"
        dropdown
      >
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="parallel"
        >
          <SquareMinus className="btn-format cursor-pointer" />
          <MobileText text="Horizontal rule" />
        </button>
      </ButtonCard>
      <ButtonCard
        editor={editor}
        text="Toggle Word / Character Count"
        dropdown
      >
        <CountsDropdown counts={counts} mobile />
      </ButtonCard>
    </LargeDropdown>
  )
}
