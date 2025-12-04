import { ArrowDown } from 'lucide-react'
import { sortDocuments, sortAlphabetically } from '@/lib/helpers/sort'
import { Document } from '@/lib/Constants/dataTypes'
import { useMemo } from 'react'

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
  return (
    <>
      <div className="relative m-5 flex items-center justify-between">
        <div className="flex flex-row items-center space-x-10">
          <button
            onClick={() => toggleDropdown(!dropdown)}
            className="relative flex cursor-pointer justify-end rounded-sm bg-gray-100 p-2 shadow-sm hover:bg-gray-300"
          >
            Sort By
            <ArrowDown />
          </button>
        </div>
      </div>
      {dropdown && (
        <div className="absolute top-full right-20 mt-2 flex flex-col items-start rounded-md bg-gray-100 p-3 shadow-lg">
          {Object.entries(sortFunctions).map(([key, sortFunction]) => (
            <button
              key={key}
              onClick={() => {
                sortFunction()
                toggleDropdown(false)
              }}
              className="cursor-pointer"
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
