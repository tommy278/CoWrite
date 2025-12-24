import { Link } from '@tanstack/react-router'
import Logout from '@/components/Logout'
import { Route as ParentRoute } from '@/routes/__root'
import { LogIn, Plus, Settings } from 'lucide-react'

export default function DesktopNavbar() {
  const { user } = ParentRoute.useRouteContext()

  return (
    <div className="hidden items-center md:flex">
      <nav className="flex space-x-4">
        {user ? (
          <div className="flex items-center">
            <Link
              to="/dashboard/settings"
              className="mr-1 rounded-full bg-gray-400 p-2 transition-transform duration-150 hover:scale-105"
            >
              <Settings size={20} />
            </Link>
            <Logout />
          </div>
        ) : (
          <>
            <Link
              to="/auth/login"
              className="flex items-center gap-3 rounded-lg border border-white p-3 transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-colors border-none',
              }}
            >
              <LogIn size={20} />
              Log In
            </Link>
            <Link
              to="/auth/register"
              className="flex items-center gap-3 rounded-lg border border-white p-3 transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-colors border-none',
              }}
            >
              <Plus size={20} />
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
