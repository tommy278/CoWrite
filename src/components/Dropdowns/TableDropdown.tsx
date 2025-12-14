import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import {
  BetweenVerticalEnd,
  Minus,
  Trash,
  Settings,
  ArrowRight,
  ArrowLeft,
  Grid2x2X,
  BetweenVerticalStart,
  BetweenHorizontalStart,
  BetweenHorizontalEnd,
  TableCellsMerge,
  TableRowsSplit,
  Table,
  ChevronDown,
} from 'lucide-react'
import ToolTip from '../ToolTip'
import { clickDetector } from '@/context/clickDetector'

export default function TableDropdown({ editor }: { editor: Editor }) {
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selected, setSelected] = useState({ row: 0, col: 0 })
  const [hovered, setHovered] = useState({ row: 0, col: 0 })

  const handleClose = () => {
    setIsDisplayOpen(false)
    setIsDropdownOpen(false)
  }

  const ref = clickDetector(() => handleClose())
  const rows = 10
  const cols = 8
  return (
    <>
      <div className="flex" ref={ref}>
        <button
          onClick={() => {
            setIsDisplayOpen((prev) => !prev)
            setIsDropdownOpen(false)
          }}
          className="cursor-pointer"
        >
          <Table className="btn-format" />
        </button>

        <button
          onClick={() => {
            setIsDropdownOpen((prev) => !prev)
            setIsDisplayOpen(false)
          }}
        >
          <ChevronDown className="btn-format cursor-pointer" />
        </button>
      </div>
      {isDisplayOpen && !isDropdownOpen && (
        <div className="dropdown flex-col space-y-1">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex space-x-1">
              {Array.from({ length: cols }).map((_, colIndex) => {
                const isActive =
                  selected.row >= rowIndex && selected.col >= colIndex
                const isHover =
                  hovered.row >= rowIndex && hovered.col >= colIndex
                return (
                  <div
                    key={colIndex}
                    className={`h-6 w-6 cursor-pointer border ${
                      isActive
                        ? 'bg-blue-400'
                        : isHover
                          ? 'bg-blue-200'
                          : 'bg-gray-300'
                    }`}
                    onMouseEnter={() =>
                      setHovered({ row: rowIndex, col: colIndex })
                    }
                    onMouseLeave={() => setHovered({ row: 0, col: 0 })}
                    onClick={() => {
                      setSelected({ row: rowIndex, col: colIndex })
                      editor
                        .chain()
                        .focus()
                        .insertTable({
                          rows: rowIndex + 1,
                          cols: colIndex + 1,
                          withHeaderRow: true,
                        })
                        .run()
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      )}
      {isDropdownOpen && (
        <div className="dropdown grid grid-cols-3 gap-2">
          <ToolTip text="Add column before">
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <BetweenVerticalStart />
            </button>
          </ToolTip>

          <ToolTip text="Add column after">
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <BetweenVerticalEnd />
            </button>
          </ToolTip>

          <ToolTip text="Delete Column">
            <button onClick={() => editor.chain().focus().deleteColumn().run()}>
              <Minus />
            </button>
          </ToolTip>
          <button onClick={() => editor.chain().focus().addRowBefore().run()}>
            <BetweenHorizontalStart />
          </button>
          <button onClick={() => editor.chain().focus().addRowAfter().run()}>
            <BetweenHorizontalEnd />
          </button>
          <button onClick={() => editor.chain().focus().deleteRow().run()}>
            <Trash />
          </button>
          <button onClick={() => editor.chain().focus().deleteTable().run()}>
            <Grid2x2X />
          </button>
          <button onClick={() => editor.chain().focus().mergeCells().run()}>
            <TableCellsMerge />
          </button>
          <button onClick={() => editor.chain().focus().splitCell().run()}>
            <TableRowsSplit />
          </button>
          <button onClick={() => editor.chain().focus().fixTables().run()}>
            <Settings />
          </button>
          <button onClick={() => editor.chain().focus().goToNextCell().run()}>
            <ArrowRight />
          </button>
          <button
            onClick={() => editor.chain().focus().goToPreviousCell().run()}
          >
            <ArrowLeft />
          </button>
        </div>
      )}
    </>
  )
}
