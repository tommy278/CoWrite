import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { getUserFn } from '@/lib/serverFunctions/getUserFn'

export const Route = createFileRoute('/')({
  component: App,
  beforeLoad: async () => {
    const user = await getUserFn()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
    return { user }
  },
})

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-10 bg-gray-50">
      <h1 className="text-7xl font-bold text-blue-500">Default App</h1>
      <h2 className="text-base">This is the default line to display the app</h2>
      <Link
        to="/auth/register"
        className="hover: rounded-md bg-blue-500 p-2 text-gray-700 transition duration-200 hover:scale-105 hover:bg-blue-400 hover:shadow-lg"
      >
        Register here
      </Link>
    </div>
  )
}
