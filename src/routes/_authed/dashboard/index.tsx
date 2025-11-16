import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Route as ParentRoute } from '@/routes/__root'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { createDocumentFn } from '@/lib/serverFunctions/createDocument'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = ParentRoute.useRouteContext()
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
        console.log(user.id)
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
    <div>
      {!isOpen && <button onClick={() => setIsOpen(!isOpen)}>Expand</button>}
      {isOpen && (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
    </div>
  )
}
