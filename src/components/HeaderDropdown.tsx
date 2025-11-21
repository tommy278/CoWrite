import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { MdArrowDropDownCircle } from 'react-icons/md'

type Level = 1 | 2 | 3 | 4 | 5 | 6
const levels: Level[] = [1, 2, 3, 4, 5, 6]

export default function HeaderDropdown({ editor }: { editor: Editor }) {
  const [lastOpened, setLastOpened] = useState<Level | null>(null)
  const [headerOpen, toggleHeaderOpen] = useState(false)
  const handleClick = (level: Level) => {
    editor.chain().focus().toggleHeading({ level }).run()
    setLastOpened(level)
    toggleHeaderOpen(false)
  }
  return (
    <div>
      <div className="flex items-center">
        {lastOpened ? (
          <button
            onClick={() => handleClick(lastOpened)}
            className={
              editor.isActive('heading', { lastOpened }) ? 'font-bold' : ''
            }
          >
            H{lastOpened}
          </button>
        ) : (
          <button className="flex items-center">H</button>
        )}
        <MdArrowDropDownCircle onClick={() => toggleHeaderOpen(!headerOpen)} />
      </div>
      {headerOpen && (
        <div className="inset fixed z-50">
          {levels.map((level, index) => (
            <div key={index}>
              <button
                onClick={() => handleClick(level)}
                className={
                  editor.isActive('heading', { level }) ? 'font-bold' : ''
                }
              >
                {`Heading ${level}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
