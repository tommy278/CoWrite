import { Link } from '@tanstack/react-router'
import { Home, X, LogIn, Plus, UserRoundPen } from 'lucide-react'
import Logout from '@/components/Logout'
import { Route as ParentRoute } from '@/routes/__root'
import { Trash } from 'lucide-react'
import { clickDetector } from '@/Hooks/clickDetector'

interface MobileNavbarProps {
  isOpen: boolean | null
  setIsOpen?: (state: boolean) => void | null
}

export default function MobileNavbar(props: MobileNavbarProps) {
  const { isOpen, setIsOpen } = props ?? {}
  const { user } = ParentRoute.useRouteContext()
  const ref = clickDetector(() => setIsOpen?.(false))
  return (
    <>
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-60 transform flex-col bg-blue-800/95 text-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-80 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={ref}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen?.(false)}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-300 dark:hover:bg-blue-700"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          <Link
            to={user ? '/dashboard/documents' : '/'}
            onClick={() => setIsOpen?.(false)}
            className="flex items-center gap-3 rounded-lg p-3 transition-transform duration-150 hover:scale-105 hover:bg-gray-800"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors',
            }}
            activeOptions={{ exact: true }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard/profile"
                onClick={() => setIsOpen?.(false)}
                className="flex items-center gap-3 rounded-lg p-3 transition-transform duration-150 hover:scale-105 hover:bg-gray-800"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors',
                }}
              >
                <UserRoundPen size={20} />
                <span className="font-medium">Profile</span>
              </Link>
              <Link
                to="/dashboard/documents/deleted"
                onClick={() => setIsOpen?.(false)}
                className="flex items-center gap-3 rounded-lg p-3 transition-transform duration-150 hover:scale-105 hover:bg-gray-800"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors',
                }}
              >
                <Trash size={20} />
                <span className="font-medium">Deleted</span>
              </Link>
              <Logout onLogout={() => setIsOpen?.(false)} />
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                onClick={() => setIsOpen?.(false)}
                className="flex items-center gap-3 rounded-lg p-3 transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-colors',
                }}
              >
                <LogIn size={20} />
                Log In
              </Link>

              <Link
                to="/auth/register"
                onClick={() => setIsOpen?.(false)}
                className="flex items-center gap-3 rounded-lg p-3 transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-colors',
                }}
              >
                <Plus size={20} />
                Register
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
