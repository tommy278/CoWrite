import { useForm } from '@tanstack/react-form'
import { type Document } from '@/lib/Constants/dataTypes'
import { useState } from 'react'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { Link } from '@tanstack/react-router'

export default function SearchBar({ documents }: { documents: Document[] }) {
  const searchForm = useForm({
    defaultValues: {
      search: '',
    },
  })

  const [searchResults, setSearchResults] = useState<Document[] | null>(null)

  const debouncedSearch = useDebouncedCallback(
    (search: string) => {
      const filtered = documents.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
      )
      setSearchResults(filtered)
    },
    { wait: 150 }
  )
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        searchForm.handleSubmit()
      }}
      className="relative"
    >
      <searchForm.Field
        name="search"
        validators={{
          onChange: ({ value }) => {
            debouncedSearch(value)
          },
        }}
        children={(field) => (
          <div className="relative">
            <input
              name="SearchBar"
              placeholder="Search..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input-field"
            />
            {searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 w-full">
                {searchResults.map((entry) => (
                  <Link
                    to="/dashboard/view-document/$doc_id"
                    params={{ doc_id: entry.id }}
                    className="block px-3 py-2"
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
  )
}
