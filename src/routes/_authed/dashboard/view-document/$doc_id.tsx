import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { getDocumentFn } from '@/lib/serverFunctions/getDocumentFn'
import { updateTitleFn } from '@/lib/serverFunctions/updateTitleFn'
import { updateContentFormFn } from '@/lib/serverFunctions/updateContentFormFn'
import AutoResizeTextArea from '@/lib/helpers/AutoResizeTextArea'

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
  const { id = '', title = ' Untitled Document', content = '' } = document || {}
  const titleForm = useForm({
    defaultValues: {
      id,
      title,
    },
    onSubmit: async ({ value }) => {
      try {
        const title =
          value.title.trim() === '' ? 'Untitled Document' : value.title
        await updateTitleFn({
          data: { id: value.id, title },
        })
        titleForm.setFieldValue('title', title)
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      }
    },
  })

  const contentForm = useForm({
    defaultValues: { id, content },
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
          children={(field) => (
            <>
              <input
                value={field.state.value}
                autoFocus
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`my-4 mb-5 ml-10 rounded-md border px-3 py-2 ${
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
                if (!value) return
                await updateContentFormFn({
                  data: { id, content: value },
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
              <div className="flex justify-center">
                <AutoResizeTextArea
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="rounded-md bg-gray-300"
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
