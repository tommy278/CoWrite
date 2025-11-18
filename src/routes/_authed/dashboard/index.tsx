import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { Route as ParentRoute } from '@/routes/__root'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/createDocument'
import { getAllDocumentsFn } from '@/lib/serverFunctions/getAllDocuments'
import { getUserFn } from '@/lib/serverFunctions/getUserFn'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
  loader: async () => {
    const user = await getUserFn()
    const user_id = user?.id
    if (user_id === undefined) return
    const data = await getAllDocumentsFn({ data: { user_id: user_id } })
    return data
  },
})

function RouteComponent() {
  const { user } = ParentRoute.useRouteContext()
  const data = Route.useLoaderData()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const form = useForm({
    defaultValues: { title: '' },
    onSubmit: async ({ value }) => {
      if (!user?.id) {
        alert('Something went wrong. Please log in and try again.')
        console.error('No user id found')
        return
      }
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
        {data?.map((doc, index) => (
          <Link
            key={index}
            to="/dashboard/view-document/$doc_id"
            params={{ doc_id: doc.id }}
          >
            <div className="rounded-md bg-blue-500 p-10">
              <h1>{doc.title}</h1>
              <p>{doc.content}</p>
            </div>
          </Link>
        ))}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              e.preventDefault()
              form.handleSubmit()
            }}
            className="form-content"
          >
            <button type="button" onClick={() => setIsOpen(false)}>
              Close
            </button>
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
      )}
    </>
  )
}
