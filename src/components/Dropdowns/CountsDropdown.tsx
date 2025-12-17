import { WholeWord } from 'lucide-react'
import { useState } from 'react'
import MobileText from '../MobileText'

interface CountProps {
  characters: number
  words: number
}

export default function CountsDropdown({
  counts,
  mobile,
}: {
  counts: CountProps
  mobile?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`cursor-pointer ${mobile && 'parallel'}`}
      >
        <MobileText text="Character/Word Count" />
        <WholeWord className="btn-format" />
      </button>
      {isOpen && (
        <div className="dropdown absolute top-0 right-0">
          <p>Characters: {counts.characters}</p>
          <p>Words: {counts.words}</p>
        </div>
      )}
    </div>
  )
}
