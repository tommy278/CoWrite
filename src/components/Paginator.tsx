import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PaginatorProps {
  setPage: React.Dispatch<React.SetStateAction<number>>
  page: number
  totalPages: number
}

export default function Paginator({
  setPage,
  page,
  totalPages,
}: PaginatorProps) {
  const start = Math.max(0, page - 2)
  const end = Math.min(totalPages, page + 3)
  const pagesArray = Array.from(
    { length: end - start },
    (_, i) => start + i + 1
  )
  const jumpToPage = (val: number) => {
    const clamped = Math.min(Math.max(Math.floor(val), 1), totalPages)
    setPage(clamped - 1)
    setInputValue(clamped)
  }
  const [inputValue, setInputValue] = useState(0)
  const currentPage = page + 1

  useEffect(() => {
    if (inputValue !== currentPage) {
      setInputValue(currentPage)
    }
  }, [page])
  if (totalPages > 1) {
    return (
      <div className="mx-5 my-2 flex items-center justify-between rounded-3xl bg-gray-300/50 py-2 text-xs md:px-5 md:text-sm dark:bg-gray-700/50">
        <div className="mx-auto flex w-fit items-center space-x-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className={`${page === 0 ? 'cursor-not-allowed bg-gray-300/40 dark:bg-gray-700/20' : 'cursor-pointer bg-gray-300 dark:bg-gray-500'} paginator-btn flex items-center`}
          >
            <ChevronLeft className="icon" />
            <span>Previous</span>
          </button>

          {page >= 3 && (
            <>
              <button
                onClick={() => setPage(0)}
                className="paginator-btn cursor-pointer"
              >
                1
              </button>
              <span>...</span>
            </>
          )}

          {pagesArray.map((index) => (
            <span key={index}>
              <button
                onClick={() => setPage(index - 1)}
                className={`paginator-btn cursor-pointer ${index === currentPage && 'bg-blue-400/30'}`}
              >
                {index}
              </button>
            </span>
          ))}

          {page <= totalPages - 5 && (
            <>
              <span>...</span>
              <button
                onClick={() => setPage(totalPages - 1)}
                className="paginator-btn cursor-pointer"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`${currentPage >= totalPages ? 'cursor-not-allowed bg-gray-300/40 dark:bg-gray-700/20' : 'cursor-pointer bg-gray-300 dark:bg-gray-500'} paginator-btn flex items-center`}
          >
            <span>Next</span>
            <ChevronRight className="icon" />
          </button>
        </div>

        {/* Page input at the end */}
        <div className="hidden items-center justify-end text-xs sm:flex">
          Showing
          <input
            value={inputValue}
            onBlur={() => jumpToPage(inputValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                jumpToPage(inputValue)
              }
            }}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="mx-1 w-10 rounded-sm border px-2"
            min={1}
            max={totalPages}
          />
          of {totalPages} pages
        </div>
      </div>
    )
  } else return null
}
