import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/POST/createDocument'
import { useState } from 'react'
import { generateHTML } from '@tiptap/html'
import { extensions, extraExtensions } from '@/lib/Constants/constants'
import { CirclePlus } from 'lucide-react'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

const allExtensions = [...extensions, ...extraExtensions]

function RouteComponent() {
  const { documents } = Route.useRouteContext()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Sorting in descending order
  documents.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })

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
      <div className="mt-5 grid w-full grid-cols-3 space-y-4 md:grid-cols-4">
        {!isOpen && (
          <div className="flex justify-center">
            <div className="view-height rounded-md bg-cyan-300">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-full w-full cursor-pointer items-center justify-center"
              >
                <CirclePlus id="icon" />
              </button>
            </div>
          </div>
        )}

        {documents.map((doc) => {
          if (!doc.content)
            return (
              <div key={doc.id}>
                <p>No Content found</p>
              </div>
            )
          const htmlContent = generateHTML(doc.content, allExtensions)
          return (
            <div className="flex justify-center" key={doc.id}>
              <Link
                to="/dashboard/view-document/$doc_id"
                params={{ doc_id: doc.id }}
              >
                <div className="view-height overflow-hidden rounded-md bg-blue-500 p-1">
                  <h1 id="doc-title" className="font-semibold">
                    {doc.title}
                  </h1>
                  <div
                    id="container"
                    className="overflow-hidden text-ellipsis"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </Link>
            </div>
          )
        })}
      </div>
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
