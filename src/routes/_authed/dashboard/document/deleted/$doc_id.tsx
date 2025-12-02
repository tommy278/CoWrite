import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authed/dashboard/document/deleted/$doc_id'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { doc_id } = Route.useParams()
  return <div>Hello "/_authed/dashboard/document/deleted/$doc_id"!{doc_id}</div>
}
