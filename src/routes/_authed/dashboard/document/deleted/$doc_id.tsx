import Tiptap from '@/components/Tiptap'
import { getDocumentFn } from '@/lib/serverFunctions/GET/getDocumentFn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/document/deleted/$doc_id'
)({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const document = await getDocumentFn({ data: { id: params.doc_id } })
    return {
      ...context,
      headerType: 'doc',
      document_id: document?.id,
    }
  },
})

function RouteComponent() {
  const { doc_id } = Route.useParams()
  const { documents } = Route.useRouteContext()
  const document = documents.find((document) => document.id === doc_id)
  if (!document) return null
  return (
    <div className="w-full">
      <Tiptap id={doc_id} value={document.content} editable={false} />
    </div>
  )
}
