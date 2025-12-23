import { createFileRoute } from '@tanstack/react-router'
import DarkModeToggle from '@/components/DarkModeToggle'

export const Route = createFileRoute('/_authed/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { profile } = Route.useRouteContext()
  return (
    <>
      <p>{profile!.display_name}</p>
      <DarkModeToggle />
    </>
  )
}
