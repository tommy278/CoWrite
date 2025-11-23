import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/createDocument'
import { useState } from 'react'
import { generateHTML } from '@tiptap/html'
import { extensions } from '@/lib/constants'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { documents } = Route.useRouteContext()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

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
      <div className="grid grid-cols-3 gap-4 p-4">
        {!isOpen && (
          <div className="rounded-md bg-cyan-200 p-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-full w-full cursor-pointer"
            >
              Expand
            </button>
          </div>
        )}

        {documents.map((doc) => {
          if (!doc.content) return <p>No Content found</p>
          const htmlContent = generateHTML(doc.content, extensions)
          return (
            <Link
              key={doc.id}
              to="/dashboard/view-document/$doc_id"
              params={{ doc_id: doc.id }}
            >
              <div className="rounded-md bg-blue-500 p-10">
                <h1 className="font-semibold">{doc.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: htmlContent }}></p>
              </div>
            </Link>
          )
        })}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="form-content"
            >
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) => {
                    if (value.length < 3) return 'Title not long enough'
                    if (value.length > 100) return 'Title too long'
                    return undefined
                  },
                }}
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
