import { useForm } from '@tanstack/react-form'
import { type Document } from '@/lib/Constants/dataTypes'
import { useState } from 'react'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { Link } from '@tanstack/react-router'
import { clickDetector } from '@/Hooks/clickDetector'
import { FilePlus, Search } from 'lucide-react'
import { restoreDocumentFn } from '@/lib/serverFunctions/UPDATE/restoreDocument'
import { useRouter } from '@tanstack/react-router'

interface SearchBarProps {
  documents: Document[]
  className?: string
}

interface SearchResultProps {
  active: Document[]
  deleted: Document[]
}

export default function SearchBar({ documents, className }: SearchBarProps) {
  const searchForm = useForm({
    defaultValues: {
      search: '',
    },
  })

  const [searchResults, setSearchResults] = useState<SearchResultProps>({
    active: [],
    deleted: [],
  })
  const [searchIsOpen, toggleSearchIsOpen] = useState(false)
  const ref = clickDetector(() => toggleSearchIsOpen(false))
  const router = useRouter()

  const debouncedSearch = useDebouncedCallback(
    (search: string) => {
      const normalized = search.trim().toLowerCase()
      if (!normalized) {
        setSearchResults({ active: [], deleted: [] })
        toggleSearchIsOpen(false)
        return
      }
      const filtered = documents.filter((doc) =>
        doc.title.toLowerCase().includes(normalized)
      )

      const active = filtered.filter((doc) => !doc.deleted)
      const deleted = filtered.filter((doc) => doc.deleted)

      const activeSorted = active
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 10)
      const deletedSorted = deleted
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 10)

      setSearchResults({
        active: [...activeSorted],
        deleted: [...deletedSorted],
      })
      toggleSearchIsOpen(active.length > 0 || deleted.length > 0)
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
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 md:pl-3">
                <Search className="h-3 w-3 text-gray-400 md:h-5 md:w-5" />
              </div>
              <input
                name="search"
                placeholder="Search..."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                onFocus={() => toggleSearchIsOpen(true)}
                className="max-w-full rounded-md border p-1 px-6 text-xs transition-all duration-150 focus:ring-2 focus:outline-none sm:w-full sm:text-sm md:px-10 md:text-base"
              />

              <div className="absolute top-full left-0 z-50 mt-3 w-full">
                {searchIsOpen && searchResults.active.length > 0 && (
                  <section className="w-full rounded-t-md bg-gray-200 dark:bg-gray-800">
                    <div className="px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Active
                    </div>
                    {searchResults.active.map((entry) => (
                      <Link
                        key={entry.id}
                        to="/dashboard/document/$doc_id"
                        params={{ doc_id: entry.id }}
                        className="block border-b border-gray-300/40 px-3 py-2 hover:bg-gray-300 dark:hover:bg-gray-700"
                      >
                        {entry.title}
                      </Link>
                    ))}
                  </section>
                )}

                {searchIsOpen && searchResults.deleted.length > 0 && (
                  <section className="w-full rounded-b-md bg-gray-200 dark:bg-gray-800">
                    <div className="px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Deleted
                    </div>
                    {searchResults.deleted.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex justify-between border-b border-gray-300/40 hover:bg-gray-300 dark:hover:bg-gray-700"
                      >
                        <Link
                          to="/dashboard/document/$doc_id"
                          params={{ doc_id: entry.id }}
                          className="block w-full rounded-md px-3 py-2"
                        >
                          {entry.title}
                        </Link>
                        <button
                          onClick={async () => {
                            await restoreDocumentFn({ data: { id: entry.id } })
                            router.invalidate({ sync: true })
                            toggleSearchIsOpen(false)
                            searchForm.setFieldValue('search', '')
                          }}
                          className="mr-2 cursor-pointer"
                        >
                          <FilePlus />
                        </button>
                      </div>
                    ))}
                  </section>
                )}
              </div>
            </div>
          )}
        />
      </form>
    </div>
  )
}
