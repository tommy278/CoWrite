import { createFileRoute, useLoaderData, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { getDocumentFn } from '@/lib/serverFunctions/getDocumentFn'
import { updateTitleFn } from '@/lib/serverFunctions/updateTitleFn'
import { updateContentFormFn } from '@/lib/serverFunctions/updateContentFormFn'
import Tiptap from '@/components/Tiptap'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

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
  const { id = '', title = 'Untitled Document' } = document || {}
  if (!document?.content) return null

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
    defaultValues: {
      id,
      content: document.content ?? { type: 'doc', content: [] },
    },
  })

  return (
    <>
      <Link to="/dashboard">back</Link>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          titleForm.handleSubmit()
        }}
        className="w-full max-w-3xl"
      >
        <titleForm.Field
          name="title"
          children={(field) => (
            <>
              <input
                value={field.state.value}
                autoFocus
                name="Title"
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
        className="flex justify-center"
      >
        <contentForm.Field
          name="content"
          asyncDebounceMs={3000}
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
              <>
                <Tiptap
                  value={field.state.value as TiptapJSON}
                  onChange={(json: TiptapJSON) => field.handleChange(json)}
                >
                  {isSaving ? <span>Saving...</span> : <span>Saved</span>}
                </Tiptap>
                {field.state.meta.errors.length > 0 && (
                  <span style={{ color: 'red' }}>
                    {field.state.meta.errors.join(', ')}
                  </span>
                )}
              </>
            )
          }}
        />
      </form>
    </>
  )
}
