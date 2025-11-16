import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getDocumentFn } from '@/lib/serverFunctions/getDocumentFn'

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
  return <div>Hello "/_authed/view-document"! {document.title}</div>
}
