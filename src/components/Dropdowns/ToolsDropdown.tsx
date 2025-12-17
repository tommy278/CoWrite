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
      <ButtonCard editor={editor} state="codeBlock" text="Toggle code block">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editorState.canCodeBlock}
          className={`parallel cursor-pointer ${editorState.isCodeBlock ? 'is-active' : ''}`}
        >
          <MobileText text="Code block" />
          <CodeXml className="btn-format" />
        </button>
      </ButtonCard>
      <ButtonCard editor={editor} state="blockQuote" text="Toggle block-quote">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editorState.canBlockQuote}
          className={`parallel cursor-pointer ${editorState.isBlockQuote ? 'is-active' : ''}`}
        >
          <MobileText text="Block quote" />
          <TextQuote className="btn-format" />
        </button>
      </ButtonCard>

      <ButtonCard editor={editor} text="Set Horizontal Rule">
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="parallel"
        >
          <MobileText text="Horizontal rule" />
          <SquareMinus className="btn-format cursor-pointer" />
        </button>
      </ButtonCard>
      <ButtonCard editor={editor} text="Toggle Word / Character Count">
        <CountsDropdown counts={counts} mobile />
      </ButtonCard>
    </LargeDropdown>
  )
}
