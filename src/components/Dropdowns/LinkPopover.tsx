import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import {
  SquareArrowOutUpRight,
  ImagePlus,
  Trash,
  CornerDownLeft,
  Link,
} from 'lucide-react'
import { RxDividerVertical } from 'react-icons/rx'
import { clickDetector } from '@/context/clickDetector'

export default function LinkPopover({
  editor,
  type,
}: {
  editor: Editor
  type: 'image' | 'link'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const handlers = {
    image: () => editor.chain().focus().setImage({ src: inputValue }).run(),
    link: () =>
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: inputValue })
        .run(),
  }
  const addLink = () => {
    if (!inputValue) return
    handlers[type]()
    setInputValue('')
  }
  const ref = clickDetector(() => setIsOpen(false))
  return (
    <div ref={ref} className="flex items-center">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        {type === 'image' ? (
          <ImagePlus className="btn-format cursor-pointer" />
        ) : type === 'link' ? (
          <Link className="btn-format cursor-pointer" />
        ) : null}
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
          <button
            onClick={addLink}
            disabled={!inputValue}
            className="cursor-pointer"
          >
            {<CornerDownLeft />}
          </button>
          <RxDividerVertical size={30} />
          <a href={inputValue || undefined}>
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
