import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/POST/createDocument'
import { useState } from 'react'
import { Document } from '@/lib/Constants/dataTypes'
import { clickDetector } from '@/context/clickDetector'
import { ArrowDown } from 'lucide-react'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import {
  sortAscending,
  sortAlphabetically,
  sortDescending,
} from '@/lib/helpers/sort'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { documents } = Route.useRouteContext()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [dropdown, toggleDropdown] = useState(false)
  const [orderedDocuments, setOrderedDocuments] = useState<Document[]>(() => [
    ...documents
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .filter((document) => document.deleted === false),
  ])

  const ref = clickDetector(() => toggleDropdown(false))

  const sortFunctions = {
    Ascending: () => sortAscending(setOrderedDocuments),
    Descending: () => sortDescending(setOrderedDocuments),
    Alphabetically: () => sortAlphabetically(setOrderedDocuments),
  }

  const form = useForm({
    defaultValues: { title: '' },
    onSubmit: async ({ value }) => {
      try {
        const newDocument = await createDocumentFn({
          data: { title: value.title },
        })
        if (!newDocument) throw new Error('No Document returned ')
        form.reset()
        setIsOpen(false)
        router.navigate({ to: `/dashboard/view-document/${newDocument.id}` })
      } catch (error) {
        console.error(error)
        alert('Something went wrong creating the document')
      }
    },
  })
  return (
    <>
      <span ref={ref} className="relative">
        <div className="m-5 flex items-center justify-between">
          <h3 className="text-base font-semibold">All Documents</h3>
          <button
            onClick={() => toggleDropdown((prev) => !prev)}
            className="relative flex cursor-pointer justify-end rounded-sm bg-gray-100 p-2 shadow-sm hover:bg-gray-300"
          >
            Sort By
            <ArrowDown />
          </button>
        </div>
        {dropdown && (
          <div className="absolute top-full right-5 mt-2 flex flex-col items-start rounded-md bg-gray-100 p-3 shadow-lg">
            {Object.entries(sortFunctions).map(([key, sortFunction]) => (
              <button
                key={key}
                onClick={sortFunction}
                className="cursor-pointer space-y-2"
              >
                {key}
              </button>
            ))}
          </div>
        )}
      </span>

      <DocumentDisplay
        isOpen={isOpen}
        documents={orderedDocuments}
        setIsOpen={setIsOpen}
        documentPage={true}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[80%] md:w-[50%]"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="w-full space-y-5 rounded bg-white p-6 shadow-lg"
            >
              <form.Field
                name="title"
                children={(field) => (
                  <>
                    <input
                      value={field.state.value}
                      placeholder="Title"
                      autoFocus
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`input-field ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {field.state.meta.errors.map((error, i) => (
                      <div key={i} className="text-red-500">
                        {error}
                      </div>
                    ))}
                  </>
                )}
              />
              <button type="submit" className="button-primary">
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
