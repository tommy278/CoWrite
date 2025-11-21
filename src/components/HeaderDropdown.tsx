import type { Editor } from '@tiptap/react'

const levels: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6]

export default function HeaderDropdown({ editor }: { editor: Editor }) {
  return (
    <div className="inset fixed z-50">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'font-bold' : ''}
      >
        H1
      </button>
      {levels.map((level, index) => (
        <div key={index}>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: level }).run()
            }
            className={
              editor.isActive('heading', { level: level }) ? 'font-bold' : ''
            }
          >
            {`H${level}`}
          </button>
        </div>
      ))}
    </div>
  )
}
