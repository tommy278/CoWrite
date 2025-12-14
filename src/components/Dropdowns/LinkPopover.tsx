import type { Editor } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import {
  SquareArrowOutUpRight,
  ImagePlus,
  Trash,
  CornerDownLeft,
  Link,
  Columns3Cog,
  X,
  Youtube as YT,
} from 'lucide-react'
import { RxDividerVertical } from 'react-icons/rx'
import { clickDetector } from '@/context/clickDetector'

export default function LinkPopover({
  editor,
  type,
}: {
  editor: Editor
  type: 'image' | 'link' | 'youtube'
}) {
  const PRESETS = {
    small: { width: '560', height: '315' },
    medium: { width: '640', height: '360' },
    large: { width: '960', height: '540' },
  }

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [height, setHeight] = useState(PRESETS.medium.height)
  const [width, setWidth] = useState(PRESETS.medium.width)
  const [customViewOpen, setCustomViewOpen] = useState(false)

  const parseSize = (value: string, min: number, fallback: number) => {
    const number = parseInt(value, 10)
    if (Number.isNaN(number)) return fallback
    return Math.max(min, number)
  }

  const handlers = {
    image: () => editor.chain().focus().setImage({ src: inputValue }).run(),
    link: () =>
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: inputValue })
        .run(),
    youtube: () =>
      editor.commands.setYoutubeVideo({
        src: inputValue,
        width: parseSize(width, 320, 640),
        height: parseSize(height, 180, 480),
      }),
  }
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const addLink = () => {
    if (!inputValue.trim()) return
    handlers[type]()
    setInputValue('')
    setIsOpen(false)
  }
  const ref = clickDetector(() => setIsOpen(false))
  return (
    <div ref={ref} className="flex items-center">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        {type === 'image' ? (
          <ImagePlus className="btn-format cursor-pointer" />
        ) : type === 'link' ? (
          <Link className="btn-format cursor-pointer" />
        ) : type === 'youtube' ? (
          <YT className="btn-format cursor-pointer" />
        ) : null}
      </button>
      {isOpen && (
        <div className="dropdown flex-col">
          {type === 'youtube' && (
            <div className="relative flex w-auto max-w-[280px] min-w-[180px] justify-between">
              {!customViewOpen && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setWidth(PRESETS.small.width)
                      setHeight(PRESETS.small.height)
                    }}
                    className={`cursor-pointer p-1 ${
                      width === PRESETS.small.width &&
                      height === PRESETS.small.height
                        ? 'border border-blue-300'
                        : ''
                    }`}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => {
                      setWidth(PRESETS.medium.width)
                      setHeight(PRESETS.medium.height)
                    }}
                    className={`cursor-pointer p-1 ${
                      width === PRESETS.medium.width &&
                      height === PRESETS.medium.height
                        ? 'border border-blue-300'
                        : ''
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => {
                      setWidth(PRESETS.large.width)
                      setHeight(PRESETS.large.height)
                    }}
                    className={`cursor-pointer p-1 ${
                      width === PRESETS.large.width &&
                      height === PRESETS.large.height
                        ? 'border border-blue-300'
                        : ''
                    } `}
                  >
                    Large
                  </button>
                </div>
              )}
              {customViewOpen && (
                <div className="flex items-center gap-2">
                  <input
                    id="width"
                    type="text"
                    pattern="[0-9]*"
                    placeholder="width"
                    value={width}
                    onChange={(event) => setWidth(event.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1"
                  />
                  <input
                    id="height"
                    type="text"
                    pattern="[0-9]*"
                    placeholder="height"
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1"
                  />
                </div>
              )}
              <button
                onClick={() => setCustomViewOpen((prev) => !prev)}
                className="cursor-pointer"
              >
                {customViewOpen ? <X /> : <Columns3Cog />}
              </button>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Paste a link..."
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addLink()
                }
              }}
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
            <a href={inputValue} target="_blank" rel="noopener noreferrer">
              <SquareArrowOutUpRight />
            </a>
            <button
              className="cursor-pointer"
              onClick={() => setInputValue('')}
            >
              <Trash />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
