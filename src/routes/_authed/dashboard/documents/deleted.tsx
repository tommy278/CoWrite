import { createFileRoute, Link } from '@tanstack/react-router'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import { useState } from 'react'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { Home } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getDocumentPageFn } from '@/lib/serverFunctions/GET/getDocumentsPageFn'

export const Route = createFileRoute('/_authed/dashboard/documents/deleted')({
  component: RouteComponent,
})

const PAGE_SIZE = 20

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<'updated' | 'created'>('updated')
  if (!user) return
  const { data, isLoading } = useQuery({
    queryKey: ['documents', user?.id, page, sort],
    queryFn: () =>
      getDocumentPageFn({
        data: {
          user_id: user?.id,
          page,
          pageSize: PAGE_SIZE,
          sort,
          deleted: true,
        },
      }),
  })
  const documents = data?.documents ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)
  return (
    <>
      <div className="m-2 flex items-center justify-between md:mx-5">
        <h3 className="text-base font-semibold">Deleted Documents</h3>
        <div className="flex items-center space-x-2">
          <SortDropdown
            sort={sort}
            onChange={(nextSort) => {
              setPage(0)
              setSort(nextSort)
            }}
          />
          <Link to="/dashboard/documents" className="hidden md:block">
            <span className="flex items-center rounded-md bg-blue-400/50 p-2 hover:bg-blue-400">
              <Home size={20} className="mr-1" />
              Home
            </span>
          </Link>
        </div>
      </div>
      <DocumentDisplay documents={documents} documentPage={false} />
      <div className="flex items-center justify-between px-4">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </>
  )
}
