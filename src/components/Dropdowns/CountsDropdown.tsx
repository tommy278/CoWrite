import { WholeWord } from 'lucide-react'
import { useState } from 'react'
import MobileText from '../Mobile/MobileText'

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
  const textSize = 'flex flex-row space-x-1 text-xs md:text-sm text-xs'

  const DesktopComponent = () => {
    return (
      <div className="dropdown-right flex w-fit flex-col">
        <p className={textSize}>
          <span>Characters:</span>
          <span>{counts.characters}</span>
        </p>
        <p className={textSize}>
          <span>Words:</span> <span>{counts.words}</span>
        </p>
      </div>
    )
  }

  const MobileComponent = () => {
    return (
      <div className="absolute top-[160%] right-0 rounded-md bg-gray-400 p-1 dark:bg-gray-700">
        <p>Characters: {counts.characters}</p>
        <p>Words: {counts.words}</p>
      </div>
    )
  }
  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`cursor-pointer ${mobile && 'parallel'}`}
      >
        <WholeWord className="btn-format" />
        <MobileText text="Character/Word Count" />
      </button>
      {isOpen && !mobile && <DesktopComponent />}
      {isOpen && mobile && <MobileComponent />}
    </div>
  )
}
