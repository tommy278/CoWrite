import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { getDocumentFn } from '@/lib/serverFunctions/getDocumentFn'
import { updateContentFormFn } from '@/lib/serverFunctions/updateContentFormFn'
import { useRouter } from '@tanstack/react-router'
import Tiptap from '@/components/Tiptap'
import { useIsSaving } from '@/context/isLoading'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'

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
  const { handleSave, doneSaving } = useIsSaving()
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

  const debouncedContentUpdate = useDebouncedCallback(
    async (id: string, content: TiptapJSON) => {
      try {
        await updateContentFormFn({ data: { id, content } })
        router.invalidate({ sync: true })
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      } finally {
        doneSaving()
      }
    },
    { wait: 3000 }
  )

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
          validators={{
            onChange: async ({ value }) => {
              handleSave()
              debouncedContentUpdate(document.id, value)
            },
          }}
          children={(field) => {
            return (
              <>
                <Tiptap
                  value={field.state.value as TiptapJSON}
                  onChange={(json: TiptapJSON) => field.handleChange(json)}
                ></Tiptap>
              </>
            )
          }}
        />
      </form>
    </>
  )
}
