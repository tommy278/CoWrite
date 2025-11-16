import { Link } from '@tanstack/react-router'
import { Home, X, LogIn, Plus } from 'lucide-react'
import Logout from '@/components/Logout'
import { Route as ParentRoute } from '@/routes/__root'

interface MobileNavbarProps {
  isOpen: boolean | null
  setIsOpen?: (state: boolean) => void | null
}

export default function MobileNavbar(props: MobileNavbarProps) {
  const { isOpen, setIsOpen } = props ?? {}
  const { user } = ParentRoute.useRouteContext()
  return (
    <>
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-80 transform flex-col bg-blue-800 text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen?.(false)}
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-700"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          <Link
            to="/"
            onClick={() => setIsOpen?.(false)}
            className="flex items-center gap-3 rounded-lg p-3 transition-colors transition-transform duration-150 hover:scale-105 hover:bg-gray-800"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {user ? (
            <Logout onLogout={() => setIsOpen?.(false)} />
          ) : (
            <>
              <Link
                to="/auth/login"
                onClick={() => setIsOpen?.(false)}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
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
                className="flex items-center gap-3 rounded-lg p-3 transition-colors transition-transform duration-150 hover:scale-105 hover:bg-blue-700"
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
