import { createFileRoute } from '@tanstack/react-router'
import  Logout  from "@/components/Logout";
import { useUser } from '@/context/UserContext'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useUser();
  return (
    <div>
      <p>Welcome { user?.id }</p>
      <Logout />
    </div>
  )
}
