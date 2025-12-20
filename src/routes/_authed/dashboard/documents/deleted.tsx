import { createFileRoute, Link } from '@tanstack/react-router'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import { useState } from 'react'
import { Document } from '@/lib/Constants/dataTypes'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { clickDetector } from '@/Hooks/clickDetector'
import { Home } from 'lucide-react'

export const Route = createFileRoute('/_authed/dashboard/documents/deleted')({
  component: RouteComponent,
})

function RouteComponent() {
  const { documents } = Route.useRouteContext()
  const [deletedDocuments, setDeletedDocuments] = useState<Document[]>(() => [
    ...documents.filter((document) => document.deleted),
  ])
  const [dropdown, toggleDropdown] = useState(false)
  const ref = clickDetector(() => toggleDropdown(false))
  return (
    <>
      <div className="mx-5 flex items-center justify-between">
        <h3 className="text-base font-semibold">Deleted Documents</h3>
        <div className="flex items-center">
          <span ref={ref} className="relative">
            <SortDropdown
              dropdown={dropdown}
              toggleDropdown={toggleDropdown}
              setOrderedDocuments={setDeletedDocuments}
              documentPage={true}
            />
          </span>
          <Link to="/dashboard/documents" className="hidden md:block">
            <span className="flex items-center rounded-md bg-blue-400/50 p-2 hover:bg-blue-400">
              <Home size={20} className="mr-1" />
              Home
            </span>
          </Link>
        </div>
      </div>
      <DocumentDisplay documents={deletedDocuments} documentPage={false} />
    </>
  )
}
