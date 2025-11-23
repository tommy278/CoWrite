import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { getDocumentFn } from '@/lib/serverFunctions/getDocumentFn'
import { updateContentFormFn } from '@/lib/serverFunctions/updateContentFormFn'
import { useRouter } from '@tanstack/react-router'
import Tiptap from '@/components/Tiptap'

interface TiptapJSON {
  type: 'doc'
  content: Array<any>
}

export const Route = createFileRoute(
  '/_authed/dashboard/view-document/$doc_id'
)({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const document = await getDocumentFn({ data: { id: params.doc_id } })
    return {
      ...context,
      headerType: 'doc',
      document_id: document?.id,
      document_title: document?.title,
    }
  },
})

function RouteComponent() {
  const { doc_id } = Route.useParams()
  const { documents } = Route.useRouteContext()
  const document = documents.find((row) => row.id === doc_id)
  const router = useRouter()
  if (!document?.content || !document?.id) return <p>Document not found</p>

  const contentForm = useForm({
    defaultValues: {
      id: document.id,
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
                await updateContentFormFn({
                  data: { id: document.id, content: value },
                })
                router.invalidate({ sync: true })
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
