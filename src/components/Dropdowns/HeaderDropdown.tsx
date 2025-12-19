import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import { clickDetector } from '@/context/clickDetector'
import {
  ChevronDown,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from 'lucide-react'

type Level = 1 | 2 | 3 | 4 | 5 | 6
const levels: Level[] = [1, 2, 3, 4, 5, 6]

const ICONS = [
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
]

export default function HeaderDropdown({ editor }: { editor: Editor }) {
  const [lastOpened, setLastOpened] = useState<Level | null>(null)
  const [headerOpen, toggleHeaderOpen] = useState(false)
  const handleClick = (level: Level) => {
    editor.chain().focus().toggleHeading({ level }).run()
    setLastOpened(level)
    toggleHeaderOpen(false)
  }

  const ref = clickDetector(() => toggleHeaderOpen(false))
  const Icon = ICONS[lastOpened ?? 0]
  return (
    <div ref={ref} className="flex items-center">
      {lastOpened ? (
        <button
          onClick={() => handleClick(lastOpened)}
          className="cursor-pointer"
        >
          <Icon className="btn-format" />
        </button>
      ) : (
        <button className="flex items-center">
          <Heading className="btn-format cursor-pointer" />
        </button>
      )}
      <ChevronDown
        className="btn-format cursor-pointer"
        onClick={() => toggleHeaderOpen(!headerOpen)}
      />
      {headerOpen && (
        <div className="dropdown flex-col">
          {levels.map((level, index) => (
            <div key={index}>
              <button
                onClick={() => handleClick(level)}
                className={`w-full cursor-pointer rounded-md px-1 py-0.5 hover:bg-gray-300 ${editor.isActive('heading', { level }) ? 'font-bold' : ''}`}
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
