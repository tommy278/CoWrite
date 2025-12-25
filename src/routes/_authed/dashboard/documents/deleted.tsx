import { createFileRoute, Link } from '@tanstack/react-router'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import { useState } from 'react'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { Home } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getDocumentPageFn } from '@/lib/serverFunctions/GET/getDocumentsPageFn'
import Paginator from '@/components/Paginator'
import DocumentsLoader from '@/components/SkeletonLoader/DocumentsLoader'
import { usePageSize } from '@/Hooks/usePageSize'
import { useSort } from '@/Hooks/useSort'

export const Route = createFileRoute('/_authed/dashboard/documents/deleted')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const [page, setPage] = useState(0)
  const { pageSize } = usePageSize()
  const { sortObject, setSortObject } = useSort()
  if (!user) return
  const { data, isLoading } = useQuery({
    queryKey: [
      'documents',
      user?.id,
      page,
      sortObject.sort,
      true,
      sortObject.ascending,
      pageSize,
    ],
    queryFn: () =>
      getDocumentPageFn({
        data: {
          user_id: user?.id,
          page,
          pageSize,
          sort: sortObject.sort,
          deleted: true,
          ascending: sortObject.ascending,
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
        <h3 className="text-base font-semibold">Deleted Documents</h3>
        <div className="flex items-center space-x-2">
          <SortDropdown
            sort={sortObject.sort}
            ascending={sortObject.ascending}
            onChange={(nextSort, ascending) => {
              setPage(0)
              setSortObject({
                sort: nextSort,
                ascending,
              })
            }}
            deleted
          />
          <Link to="/dashboard/documents" className="hidden md:block">
            <span className="flex items-center rounded-md bg-blue-400/50 p-2 hover:bg-blue-400">
              <Home size={20} className="mr-1" />
              Home
            </span>
          </Link>
        </div>
      </div>
      <DocumentDisplay documents={documents} deletedPage />
      <Paginator setPage={setPage} page={page} totalPages={totalPages} />
    </>
  )
}
