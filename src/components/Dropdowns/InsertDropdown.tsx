import { Editor } from '@tiptap/react'
import ButtonCard from '../ButtonCard'
import LargeDropdown from './LargeDropdown'
import LinkPopover from './LinkPopover'
import { ListDropdown } from './ListDropdown'
import TableDropdown from './TableDropdown'
import { Link2Off } from 'lucide-react'

export default function InsertDropdown({
  editor,
  editorState,
}: {
  editor: Editor
  editorState: any
}) {
  return (
    <LargeDropdown text="Insert">
      <ButtonCard editor={editor} dropdown>
        <ListDropdown editor={editor} editorState={editorState} mobile />
      </ButtonCard>
      <ButtonCard editor={editor} dropdown>
        <TableDropdown editor={editor} mobile />
      </ButtonCard>
      <ButtonCard editor={editor} state={'link'} dropdown>
        <>
          {!editorState.isLink ? (
            <LinkPopover type="link" editor={editor} mobile />
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

      <ButtonCard editor={editor} dropdown>
        <LinkPopover editor={editor} type="image" mobile />
      </ButtonCard>
      <ButtonCard editor={editor} dropdown>
        <LinkPopover editor={editor} type="youtube" mobile />
      </ButtonCard>
    </LargeDropdown>
  )
}
