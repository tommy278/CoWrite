import { createFileRoute } from '@tanstack/react-router'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import { useState } from 'react'
import { Document } from '@/lib/Constants/dataTypes'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { clickDetector } from '@/context/clickDetector'

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
      <span ref={ref} className="relative">
        <SortDropdown
          dropdown={dropdown}
          toggleDropdown={toggleDropdown}
          setOrderedDocuments={setDeletedDocuments}
          documentPage={true}
        />
      </span>
      <DocumentDisplay documents={deletedDocuments} documentPage={false} />
    </>
  )
}
