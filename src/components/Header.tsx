import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import MobileNavbar from '@/components/Mobile/MobileNavbar'
import DesktopNavbar from '@/components/Desktop/DesktopNavbar'
import { Route as ParentRoute } from '@/routes/__root'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = ParentRoute.useRouteContext()
  return (
    <>
      <header className="flex items-center justify-between bg-blue-900 p-4 text-white shadow-lg">
        <h1 className="ml-3 text-2xl font-semibold">
          <Link to={user ? '/dashboard' : '/'}>My App</Link>
        </h1>
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-blue-700 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <DesktopNavbar />
      </header>
    </>
  )
}
