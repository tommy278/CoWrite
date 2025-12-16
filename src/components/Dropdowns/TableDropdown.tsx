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
import DropdownCard from '../DropdownCard'

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

  const handleClose = () => {
    setIsDisplayOpen(false)
    setIsDropdownOpen(false)
  }

  const ref = clickDetector(() => handleClose())
  const rows = !mobile ? 10 : 5
  const cols = !mobile ? 8 : 5
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
          className={`${mobile ? 'absolute top-0 left-full ml-2 flex w-30 flex-col gap-1 rounded-md bg-gray-200 p-1' : 'dropdown grid grid-cols-3 gap-2'} `}
        >
          <ToolTip text="Add column before" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              <DropdownCard text="Column before">
                <BetweenVerticalStart className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Add column after" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              <DropdownCard text="Column After">
                <BetweenVerticalEnd className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Delete Column" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().deleteColumn().run()}>
              <DropdownCard text="Delete Column">
                <Minus className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Add row before" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().addRowBefore().run()}>
              <DropdownCard text="Row before">
                <BetweenHorizontalStart className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Add row after" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().addRowAfter().run()}>
              <DropdownCard text="Row after">
                <BetweenHorizontalEnd className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Delete row" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().deleteRow().run()}>
              <DropdownCard text="Delete row">
                <Trash className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Delete Table" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().deleteTable().run()}>
              <DropdownCard text="Delete table">
                <Grid2x2X className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Merge Cells" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().mergeCells().run()}>
              <DropdownCard text="Merge cells">
                <TableCellsMerge className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Split cell" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().splitCell().run()}>
              <DropdownCard text="Split cell">
                <TableRowsSplit className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Fix tables" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().fixTables().run()}>
              <DropdownCard text="Fix tables">
                <Settings className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>

          <ToolTip text="Go to next cell" dropdownChild={true}>
            <button onClick={() => editor.chain().focus().goToNextCell().run()}>
              <DropdownCard text="Next cell">
                <ArrowRight className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>
          <ToolTip text="Go to previous cell" dropdownChild={true}>
            <button
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
            >
              <DropdownCard text="Prev cell">
                <ArrowLeft className="h-5 w-5" />
              </DropdownCard>
            </button>
          </ToolTip>
        </div>
      )}
    </>
  )
}
