import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/view-document/$doc_id'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { doc_id } = Route.useParams()
  return <div>Hello "/_authed/view-document"! {doc_id}</div>
}
