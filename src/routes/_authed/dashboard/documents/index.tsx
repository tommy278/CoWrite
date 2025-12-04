import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/POST/createDocument'
import { useState } from 'react'
import { Document } from '@/lib/Constants/dataTypes'
import { clickDetector } from '@/context/clickDetector'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import SortDropdown from '@/components/Dropdowns/SortDropdown'

export const Route = createFileRoute('/_authed/dashboard/documents/')({
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
      .filter((document) => !document.deleted),
  ])

  const ref = clickDetector(() => toggleDropdown(false))

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
      <div className="mx-10 flex items-center justify-between">
        <h3 className="text-base font-semibold">All Documents</h3>
        <div className="flex items-center">
          <span ref={ref} className="relative">
            <SortDropdown
              dropdown={dropdown}
              toggleDropdown={toggleDropdown}
              setOrderedDocuments={setOrderedDocuments}
              documentPage={true}
            />
          </span>
          <Link to="/dashboard/documents/deleted" className="hidden md:block">
            Deleted
          </Link>
        </div>
      </div>

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
