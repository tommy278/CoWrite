import { createFileRoute } from '@tanstack/react-router'
import { Route as ParentRoute } from '@/routes/__root'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = ParentRoute.useRouteContext()
  return (
    <div>
      <h1 className="mt-10 flex justify-center text-3xl font-semibold text-sky-400">
        Welcome{' '}
        {user?.user_metadata.display_name
          ? user?.user_metadata.display_name
          : user?.email?.split('@')[0]}{' '}
        !!
      </h1>
    </div>
  )
}
