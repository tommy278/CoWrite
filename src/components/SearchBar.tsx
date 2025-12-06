import { useForm } from '@tanstack/react-form'
import { type Document } from '@/lib/Constants/dataTypes'
import { useState } from 'react'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { Link } from '@tanstack/react-router'
import { clickDetector } from '@/context/clickDetector'
import { Search } from 'lucide-react'

interface SearchBarProps {
  documents: Document[]
  className?: string
}

export default function SearchBar({ documents, className }: SearchBarProps) {
  const searchForm = useForm({
    defaultValues: {
      search: '',
    },
  })

  const [searchResults, setSearchResults] = useState<Document[]>([])
  const [searchIsOpen, toggleSearchIsOpen] = useState(false)
  const ref = clickDetector(() => toggleSearchIsOpen(false))

  const debouncedSearch = useDebouncedCallback(
    (search: string) => {
      const normalized = search.trim().toLowerCase()
      if (!normalized) {
        setSearchResults([])
        toggleSearchIsOpen(false)
        return
      }
      const filtered = documents
        .filter((doc) => doc.title.toLowerCase().includes(normalized))
        .slice(0, 20)
      setSearchResults(filtered)
      toggleSearchIsOpen(true)
    },
    { wait: 150 }
  )
  return (
    <div ref={ref}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          searchForm.handleSubmit()
        }}
        className={className ? `${className} relative` : 'relative'}
      >
        <searchForm.Field
          name="search"
          validators={{
            onChange: ({ value }) => {
              debouncedSearch(value)
            },
          }}
          children={(field) => (
            <div className="relative w-full">
              {/* Search logo inside the input field */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="search"
                placeholder="Search..."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                onFocus={() => toggleSearchIsOpen(true)}
                className="h-10 w-full rounded-md border px-10 transition-all duration-150 focus:ring-2 focus:outline-none"
              />
              {searchIsOpen && searchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 z-50 mt-3 w-full rounded-md bg-gray-200 dark:bg-gray-800">
                  {searchResults.map((entry) => (
                    <Link
                      key={entry.id}
                      to="/dashboard/document/$doc_id"
                      params={{ doc_id: entry.id }}
                      className="block rounded-md px-3 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      {entry.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </form>
    </div>
  )
}
