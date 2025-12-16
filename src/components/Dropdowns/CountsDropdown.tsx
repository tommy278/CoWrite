import { clickDetector } from '@/context/clickDetector'
import { WholeWord } from 'lucide-react'
import { useState } from 'react'

interface CountProps {
  characters: number
  words: number
}

export default function CountsDropdown({ counts }: { counts: CountProps }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = clickDetector(() => setIsOpen(false))
  return (
    <div className="flex items-center" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        <WholeWord className="btn-format" />
      </button>
      {isOpen && (
        <div className="dropdown">
          <p>Characters: {counts.characters}</p>
          <p>Words: {counts.words}</p>
        </div>
      )}
    </div>
  )
}
