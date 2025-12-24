import Tiptap from '@/components/Tiptap'
import { getDocumentFn } from '@/lib/serverFunctions/GET/getDocumentFn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/document/deleted/$doc_id'
)({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const document = await getDocumentFn({
      data: { id: params.doc_id },
    })
    return {
      ...context,
      document,
      headerType: 'doc',
    }
  },
})

function RouteComponent() {
  const { document } = Route.useRouteContext()
  if (!document) return null
  return (
    <div className="w-full">
      <Tiptap value={document.content} editable={false} />
    </div>
  )
}
