import Tiptap from '@/components/Tiptap'
import { getDocumentFn } from '@/lib/serverFunctions/GET/getDocumentFn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/document/deleted/$doc_id'
)({
  component: RouteComponent,
  beforeLoad: ({ context, params }) => {
    return {
      ...context,
      headerType: 'doc',
      document_id: params.doc_id, 
    }
  },
  loader: async ({ params }) => {
    const document = await getDocumentFn({
      data: { id: params.doc_id },
    })
    return { document }
  },
})

function RouteComponent() {
  const {document} = Route.useLoaderData()
  if (!document) return null
  return (
    <div className="w-full">
      <Tiptap value={document.content} editable={false} />
    </div>
  )
}
