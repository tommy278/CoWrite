import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { getDocumentFn } from '@/lib/serverFunctions/getDocumentFn'
import { updateTitleFn } from '@/lib/serverFunctions/updateTitleFn'
import { updateContentFormFn } from '@/lib/serverFunctions/updateContentFormFn'

export const Route = createFileRoute(
  '/_authed/dashboard/view-document/$doc_id'
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const document = await getDocumentFn({ data: { id: params.doc_id } })
    return document
  },
})

function RouteComponent() {
  const document = useLoaderData({
    from: '/_authed/dashboard/view-document/$doc_id',
  })
  console.log(document.id)
  const titleForm = useForm({
    defaultValues: { id: document.id, title: document.title },
    onSubmit: async ({ value }) => {
      try {
        await updateTitleFn({
          data: { id: value.id, title: value.title },
        })
        alert('Title successfully updated')
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      }
    },
  })

  const contentForm = useForm({
    defaultValues: { id: document.id, content: document.content ?? '' },
  })

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          titleForm.handleSubmit()
        }}
      >
        <titleForm.Field
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
                autoFocus
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`px-3 py-2 ${
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
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          contentForm.handleSubmit()
        }}
      >
        <contentForm.Field
          name="content"
          asyncDebounceMs={1000}
          validators={{
            onChangeAsync: async ({ value }) => {
              try {
                await updateContentFormFn({
                  data: { id: document.id, content: value },
                })
              } catch (error) {
                console.error(error)
                alert('Something went wrong')
              }
            },
          }}
          children={(field) => {
            const isSaving = field.state.meta.isValidating

            return (
              <div>
                <textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={5}
                />
                {isSaving && <span>Saving...</span>}
                {field.state.meta.errors.length > 0 && (
                  <span style={{ color: 'red' }}>
                    {field.state.meta.errors.join(', ')}
                  </span>
                )}
              </div>
            )
          }}
        />
      </form>
    </div>
  )
}
