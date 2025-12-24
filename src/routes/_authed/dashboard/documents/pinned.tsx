import DocumentsLoader from '@/components/SkeletonLoader/DocumentsLoader'
import { usePageSize } from '@/Hooks/usePageSize'
import { getDocumentPageFn } from '@/lib/serverFunctions/GET/getDocumentsPageFn'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import Paginator from '@/components/Paginator'
import { Home } from 'lucide-react'

export const Route = createFileRoute('/_authed/dashboard/documents/pinned')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const [page, setPage] = useState(0)
  const { pageSize } = usePageSize()
  if (!user) return
  const { data, isLoading } = useQuery({
    queryKey: ['documents', user?.id, page, false, pageSize, true],
    queryFn: () =>
      getDocumentPageFn({
        data: {
          user_id: user?.id,
          page,
          pageSize,
          deleted: false,
          pinned: true,
        },
      }),
    staleTime: 1000 * 60 * 5,
  })
  const documents = data?.documents ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)
  if (isLoading) return <DocumentsLoader />
  return (
    <>
      <div className="m-2 flex items-center justify-between md:mx-5">
        <h3 className="text-base font-semibold">Pinned Documents</h3>
        <div className="flex items-center space-x-2">
          <Link to="/dashboard/documents" className="hidden md:block">
            <span className="flex items-center rounded-md bg-blue-400/50 p-2 hover:bg-blue-400">
              <Home size={20} className="mr-1" />
              Home
            </span>
          </Link>
        </div>
      </div>
      <DocumentDisplay documents={documents} />
      <Paginator setPage={setPage} page={page} totalPages={totalPages} />
    </>
  )
}
