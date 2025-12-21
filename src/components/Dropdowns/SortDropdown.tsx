import { ArrowDown } from 'lucide-react'
import { sortDocuments, sortAlphabetically } from '@/lib/helpers/sort'
import { Document } from '@/lib/Constants/dataTypes'
import { useMemo } from 'react'
import { clickDetector } from '@/Hooks/clickDetector'

interface SortDropdownProps {
  toggleDropdown: (dropdown: boolean) => void
  dropdown: boolean
  setOrderedDocuments: React.Dispatch<React.SetStateAction<Document[]>>
  documentPage: boolean
}

export default function SortDropdown({
  toggleDropdown,
  dropdown,
  setOrderedDocuments,
  documentPage,
}: SortDropdownProps) {
  const time = documentPage ? 'updated_at' : 'deleted_at'
  const sortFunctions = useMemo(
    () => ({
      Ascending: () => sortDocuments(setOrderedDocuments, time, 'asc'),
      Descending: () => sortDocuments(setOrderedDocuments, time, 'desc'),
      Alphabetically: () => sortAlphabetically(setOrderedDocuments),
    }),
    [setOrderedDocuments, time]
  )
  const ref = clickDetector(() => toggleDropdown(false))
  return (
    <div ref={ref} className="relative">
      <div className="relative flex items-center justify-between">
        <div className="flex flex-row items-center space-x-10">
          <button
            onClick={() => toggleDropdown(!dropdown)}
            className="relative flex cursor-pointer items-center justify-end rounded-sm bg-gray-100 p-2 shadow-sm hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600"
          >
            <p className="text-xs sm:text-sm md:text-base">Sort by</p>
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>
      </div>
      {dropdown && (
        <div className="absolute top-full right-0 z-50 mt-2 flex flex-col items-start rounded-md bg-gray-200 p-3 shadow-lg dark:bg-gray-600">
          {Object.entries(sortFunctions).map(([key, sortFunction]) => (
            <button
              key={key}
              onClick={() => {
                sortFunction()
                toggleDropdown(false)
              }}
              className="flex w-full cursor-pointer items-center justify-start rounded-md p-0.5 hover:bg-gray-300 md:p-1 dark:hover:bg-gray-700"
            >
              <p className="text-xs sm:text-sm md:text-base">{key}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
