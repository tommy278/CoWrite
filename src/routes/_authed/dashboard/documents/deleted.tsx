import { createFileRoute } from '@tanstack/react-router'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import { useState } from 'react'
import { Document } from '@/lib/Constants/dataTypes'

export const Route = createFileRoute('/_authed/dashboard/documents/deleted')({
  component: RouteComponent,
})

function RouteComponent() {
  const { documents } = Route.useRouteContext()
  const [deletedDocuments, setDeletedDocuments] = useState<Document[]>(() => [
    ...documents.filter((document) => document.deleted),
  ])
  return <DocumentDisplay documents={deletedDocuments} documentPage={false} />
}
