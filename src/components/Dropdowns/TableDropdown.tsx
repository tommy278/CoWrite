import type { Editor } from '@tiptap/react'
import { useState } from 'react'

export default function TableDropdown({ editor }: { editor: Editor }) {
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)
  const [selected, setSelected] = useState({ row: 0, col: 0 })
  const [hovered, setHovered] = useState({ row: 0, col: 0 })
  const rows = 10
  const cols = 8
  return (
    <>
      <button onClick={() => setIsDisplayOpen((prev) => !prev)}>T</button>
      {isDisplayOpen && (
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
    </>
  )
}
