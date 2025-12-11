import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import {
  SquareArrowOutUpRight,
  ImagePlus,
  Trash,
  CornerDownLeft,
} from 'lucide-react'
import { RxDividerVertical } from 'react-icons/rx'
import { clickDetector } from '@/context/clickDetector'

export default function ImageDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const addImage = () => {
    if (inputValue) editor.chain().focus().setImage({ src: inputValue }).run()
    setInputValue('')
  }
  const ref = clickDetector(() => setIsOpen(false))
  return (
    <div ref={ref} className="flex items-center">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <ImagePlus className="btn-format" />
      </button>
      {isOpen && (
        <div className="inset fixed z-50 mt-30 flex items-center space-x-2 rounded-md bg-gray-200 p-2">
          <input
            type="text"
            placeholder="Paste a link..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border-none px-1 hover:ring-0 hover:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none"
          />
          <button onClick={addImage} className="cursor-pointer">
            {<CornerDownLeft />}
          </button>
          <RxDividerVertical size={30} />
          <a href={inputValue}>
            <SquareArrowOutUpRight />
          </a>
          <button className="cursor-pointer" onClick={() => setInputValue('')}>
            <Trash />
          </button>
        </div>
      )}
    </div>
  )
}
