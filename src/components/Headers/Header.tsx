import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import MobileNavbar from '@/components/Mobile/MobileNavbar'
import DesktopNavbar from '@/components/Desktop/DesktopNavbar'
import { Route as ParentRoute } from '@/routes/__root'
import SearchBar from '../SearchBar'
import DocHeader from './DocHeader'
import { Document } from '@/lib/Constants/dataTypes'

interface HeaderProps {
  type: 'doc' | 'default'
  document: Document | null | undefined
}

export default function Header({ type, document }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = ParentRoute.useRouteContext()
  return (
    <>
      <header className="sticky top-0 z-51 flex items-center justify-between bg-blue-700 px-4 py-2 text-white shadow-lg dark:bg-blue-900">
        {type === 'default' && (
          <h1
            className={`${user ? 'w-[80%]' : 'w-[50%]'} flex items-center justify-between gap-4 text-lg font-semibold sm:text-xl md:text-2xl`}
          >
            <Link to={user ? '/dashboard/documents' : '/'}>coWrite</Link>
            {user && <SearchBar className="text-sm sm:text-xs" />}
          </h1>
        )}
        {type === 'doc' && <DocHeader document={document} />}
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded-lg p-2 hover:bg-blue-300 md:hidden dark:hover:bg-blue-700"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <DesktopNavbar />
      </header>
    </>
  )
}
