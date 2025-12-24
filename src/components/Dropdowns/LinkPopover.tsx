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
import { clickDetector } from '@/Hooks/clickDetector'
import ToolTip from '../ToolTip'
import MobileText from '../Mobile/MobileText'

export default function LinkPopover({
  editor,
  type,
  mobile,
}: {
  editor: Editor
  type: 'image' | 'link' | 'youtube'
  mobile?: boolean
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

  const TEXTS = {
    link: 'Link',
    image: 'Add Image',
    youtube: 'Add Youtube',
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
  const relative = !mobile ? 'relative' : ''
  const buttonClass =
    'rounded-md border border-blue-300 transition-transform duration-200 hover:scale-105'
  return (
    <div ref={ref} className={`flex w-full items-center ${relative}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="parallel w-full cursor-pointer"
      >
        {type === 'image' ? (
          <ImagePlus className="btn-format" />
        ) : type === 'link' ? (
          <Link className="btn-format" />
        ) : type === 'youtube' ? (
          <YT className="btn-format" />
        ) : null}
        <MobileText text={TEXTS[type]} />
      </button>
      {isOpen && (
        <div
          className={`${mobile ? 'absolute left-[101%] w-fit rounded-md bg-gray-300 p-1 text-xs sm:left-[105%] dark:bg-gray-600' : 'dropdown-right'} flex-col`}
        >
          {type === 'youtube' && (
            <div className="relative flex justify-between">
              {!customViewOpen && (
                <div className="flex gap-0 sm:gap-1 md:gap-2">
                  <button
                    onClick={() => {
                      setWidth(PRESETS.small.width)
                      setHeight(PRESETS.small.height)
                    }}
                    className={`cursor-pointer p-1 ${
                      width === PRESETS.small.width &&
                      height === PRESETS.small.height
                        ? buttonClass
                        : ''
                    }`}
                  >
                    <MobileText text="Small" primary />
                  </button>
                  <button
                    onClick={() => {
                      setWidth(PRESETS.medium.width)
                      setHeight(PRESETS.medium.height)
                    }}
                    className={`cursor-pointer p-1 ${
                      width === PRESETS.medium.width &&
                      height === PRESETS.medium.height
                        ? buttonClass
                        : ''
                    }`}
                  >
                    <MobileText text="Medium" primary />
                  </button>
                  <button
                    onClick={() => {
                      setWidth(PRESETS.large.width)
                      setHeight(PRESETS.large.height)
                    }}
                    className={`cursor-pointer p-1 ${
                      width === PRESETS.large.width &&
                      height === PRESETS.large.height
                        ? buttonClass
                        : ''
                    } `}
                  >
                    <MobileText text="Large" primary />
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
                    className="w-10 rounded-md border border-gray-300 px-2 py-1 text-xs md:w-20 md:text-base"
                  />
                  <input
                    id="height"
                    type="text"
                    pattern="[0-9]*"
                    placeholder="height"
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    className="w-10 rounded-md border border-gray-300 px-2 py-1 text-xs md:w-20 md:text-base"
                  />
                </div>
              )}
              <button
                onClick={() => setCustomViewOpen((prev) => !prev)}
                className="ml-1 cursor-pointer"
              >
                {customViewOpen ? (
                  <ToolTip text="Close">
                    <X className="icon" />
                  </ToolTip>
                ) : (
                  <ToolTip text="Open custom image size">
                    <Columns3Cog className="icon" />
                  </ToolTip>
                )}
              </button>
            </div>
          )}
          <div className="flex w-full items-center">
            <input
              type="text"
              placeholder="Link..."
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addLink()
                }
              }}
              className="w-auto border-none p-1 hover:ring-0 hover:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none sm:w-30 sm:text-xs md:w-50 md:text-base"
            />
            <ToolTip text="Apply link">
              <button
                onClick={addLink}
                disabled={!inputValue}
                className="cursor-pointer"
              >
                {<CornerDownLeft className="icon" />}
              </button>
            </ToolTip>

            <RxDividerVertical className="icon" />

            <ToolTip text="Visit link">
              <a href={inputValue} target="_blank" rel="noopener noreferrer">
                <SquareArrowOutUpRight className="icon mr-1 md:mr-2" />
              </a>
            </ToolTip>

            <ToolTip text="Clear link">
              <button
                className="cursor-pointer"
                onClick={() => setInputValue('')}
              >
                <Trash className="icon" />
              </button>
            </ToolTip>
          </div>
        </div>
      )}
    </div>
  )
}
