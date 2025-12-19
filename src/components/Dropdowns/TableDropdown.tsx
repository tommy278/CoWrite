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
import MobileText from '@/components/MobileText'

export default function TableDropdown({
  editor,
  mobile,
}: {
  editor: Editor
  mobile?: boolean
}) {
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selected, setSelected] = useState({ row: 0, col: 0 })
  const [hovered, setHovered] = useState({ row: 0, col: 0 })
  const ref = clickDetector(() => {
    setIsDisplayOpen(false)
    setIsDropdownOpen(false)
  })

  const rows = !mobile ? 10 : 5
  const cols = !mobile ? 8 : 5
  const direction = 'right'

  return (
    <div ref={ref}>
      <div className="flex space-x-1">
        <button
          onClick={() => {
            setIsDisplayOpen((prev) => !prev)
            setIsDropdownOpen(false)
          }}
          className="inline cursor-pointer"
        >
          <Table className="btn-format" />
        </button>
        <MobileText
          text="List dropdown"
          className="cursor-pointer"
          onClick={() => {
            setIsDisplayOpen((prev) => !prev)
            setIsDropdownOpen(false)
          }}
        />

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
        <div
          className={`${mobile ? 'absolute top-0 left-full ml-2' : 'dropdown'} flex-col`}
        >
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
                    className={`m-0.5 h-6 w-6 cursor-pointer border ${
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
        <div
          className={`${mobile ? 'dropdown-child' : 'dropdown flex flex-col gap-2'} `}
        >
          <ToolTip text="Add column before" dropdownChild direction={direction}>
            <button
              onClick={() => {
                editor.chain().focus().addColumnBefore().run()
              }}
              className="parallel cursor-pointer"
            >
              <BetweenVerticalStart className="h-5 w-5" />
              <MobileText text="Column before" primary />
            </button>
          </ToolTip>

          <ToolTip text="Add column after" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="parallel cursor-pointer"
            >
              <BetweenVerticalEnd className="h-5 w-5" />
              <MobileText text="Column After" primary />
            </button>
          </ToolTip>

          <ToolTip text="Delete Column" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="parallel cursor-pointer"
            >
              <Minus className="h-5 w-5" />
              <MobileText text="Delete column" primary />
            </button>
          </ToolTip>

          <ToolTip text="Add row before" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="parallel cursor-pointer"
            >
              <BetweenHorizontalStart className="h-5 w-5" />{' '}
              <MobileText text="Row before" primary />
            </button>
          </ToolTip>

          <ToolTip text="Add row after" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="parallel cursor-pointer"
            >
              <BetweenHorizontalEnd className="h-5 w-5" />
              <MobileText text="Row after" primary />
            </button>
          </ToolTip>

          <ToolTip text="Delete row" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="parallel cursor-pointer"
            >
              <Trash className="h-5 w-5" />
              <MobileText text="Delete row" primary />
            </button>
          </ToolTip>

          <ToolTip text="Delete Table" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="parallel cursor-pointer"
            >
              <Grid2x2X className="h-5 w-5" />
              <MobileText text="Delete Table" primary />
            </button>
          </ToolTip>

          <ToolTip text="Merge Cells" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="parallel cursor-pointer"
            >
              <TableCellsMerge className="h-5 w-5" />
              <MobileText text="Merge cells" primary />
            </button>
          </ToolTip>

          <ToolTip text="Split cell" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().splitCell().run()}
              className="parallel cursor-pointer"
            >
              <TableRowsSplit className="h-5 w-5" />
              <MobileText text="Split cell" primary />
            </button>
          </ToolTip>

          <ToolTip text="Fix tables" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().fixTables().run()}
              className="parallel cursor-pointer"
            >
              <Settings className="h-5 w-5" />
              <MobileText text="Fix tables" primary />
            </button>
          </ToolTip>

          <ToolTip text="Go to next cell" dropdownChild direction={direction}>
            <button
              onClick={() => editor.chain().focus().goToNextCell().run()}
              className="parallel cursor-pointer"
            >
              <ArrowRight className="h-5 w-5" />
              <MobileText text="Next cell" primary />
            </button>
          </ToolTip>
          <ToolTip
            text="Go to previous cell"
            dropdownChild
            direction={direction}
          >
            <button
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
              className="parallel cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              <MobileText text="Prev cell" primary />
            </button>
          </ToolTip>
        </div>
      )}
    </div>
  )
}
