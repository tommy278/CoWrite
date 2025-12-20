import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/POST/createDocument'
import { useState, useEffect } from 'react'
import { Document } from '@/lib/Constants/dataTypes'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { Plus, Trash } from 'lucide-react'

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
      .filter((doc) => !doc.deleted)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      }),
  ])

  useEffect(() => {
    setOrderedDocuments(
      [...documents]
        .filter((doc) => !doc.deleted)
        .sort((a, b) => {
          if (a.pinned && !b.pinned) return -1
          if (!a.pinned && b.pinned) return 1
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )
        })
    )
  }, [documents])

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
      <div className="mt-2 mb-2 ml-2 flex items-center justify-between md:mx-5">
        <h3 className="text-sm font-semibold md:text-base">All Documents</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex cursor-pointer items-center rounded-md bg-blue-400/50 p-2 hover:bg-blue-400"
          >
            <p className="hidden text-base md:flex">New Document</p>
            <p className="flex items-center text-xs sm:text-sm md:hidden">
              New
              <Plus className="h-3 w-3" />
            </p>
          </button>
          <SortDropdown
            dropdown={dropdown}
            toggleDropdown={toggleDropdown}
            setOrderedDocuments={setOrderedDocuments}
            documentPage={true}
          />
          <Link to="/dashboard/documents/deleted" className="hidden md:block">
            <span className="flex items-center rounded-md bg-red-400/50 p-2 hover:bg-red-400">
              <Trash size={20} className="mr-1" />
              <p className="text-xs sm:text-sm md:text-base">Trash</p>
            </span>
          </Link>
        </div>
      </div>

      <DocumentDisplay documents={orderedDocuments} documentPage={true} />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex w-full items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="w-full space-y-5 rounded bg-gray-200/10 p-6 shadow-lg dark:bg-gray-600"
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
