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

  return (
    <div ref={ref}>
      <div className="flex">
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
            setIsDisplayOpen((prev) => !prev)
            setIsDropdownOpen(false)
          }}
          className="inline cursor-pointer"
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
        <div
          className={`${mobile ? 'absolute top-0 left-full' : 'dropdown'} flex-col`}
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
        <div
          className={`${mobile ? 'dropdown-child' : 'dropdown flex flex-col gap-2'} `}
        >
          <ToolTip text="Add column before" dropdownChild={true}>
            <button
              onClick={() => {
                editor.chain().focus().addColumnBefore().run()
              }}
              className="parallel cursor-pointer"
            >
              <MobileText text="Column before" primary />
              <BetweenVerticalStart className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Add column after" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Column After" primary />
              <BetweenVerticalEnd className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Delete Column" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Delete column" primary />
              <Minus className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Add row before" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Row before" primary />
              <BetweenHorizontalStart className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Add row after" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Row after" primary />
              <BetweenHorizontalEnd className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Delete row" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Delete row" primary />
              <Trash className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Delete Table" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Delete Table" primary />
              <Grid2x2X className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Merge Cells" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Merge cells" primary />
              <TableCellsMerge className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Split cell" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().splitCell().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Split cell" primary />
              <TableRowsSplit className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Fix tables" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().fixTables().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Fix tables" primary />
              <Settings className="h-5 w-5" />
            </button>
          </ToolTip>

          <ToolTip text="Go to next cell" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().goToNextCell().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Next cell" primary />
              <ArrowRight className="h-5 w-5" />
            </button>
          </ToolTip>
          <ToolTip text="Go to previous cell" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
              className="parallel cursor-pointer"
            >
              <MobileText text="Prev cell" primary />
              <ArrowLeft className="h-5 w-5" />
            </button>
          </ToolTip>
        </div>
      )}
    </div>
  )
}
