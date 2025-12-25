import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createDocumentFn } from '@/lib/serverFunctions/POST/createDocument'
import { useState } from 'react'
import DocumentDisplay from '@/components/Display/DocumentDisplay'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { Plus, Trash } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDocumentPageFn } from '@/lib/serverFunctions/GET/getDocumentsPageFn'
import Paginator from '@/components/Paginator'
import DocumentsLoader from '@/components/SkeletonLoader/DocumentsLoader'
import { usePageSize } from '@/Hooks/usePageSize'
import { useSort } from '@/Hooks/useSort'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authed/dashboard/documents/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [page, setPage] = useState(0)
  const { user } = Route.useRouteContext()
  const { pageSize } = usePageSize()
  const { sortObject, setSortObject } = useSort()
  if (!user) return
  const { data, isLoading } = useQuery({
    queryKey: [
      'documents',
      user?.id,
      page,
      sortObject.sort,
      false,
      sortObject.ascending,
    ],
    queryFn: () =>
      getDocumentPageFn({
        data: {
          user_id: user?.id,
          page,
          pageSize,
          sort: sortObject.sort,
          deleted: false,
          ascending: sortObject.ascending,
        },
      }),
    staleTime: 1000 * 60 * 5,
  })
  const documents = data?.documents ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: { title: '' },
    onSubmit: async ({ value }) => {
      try {
        const newDocument = await createDocumentFn({
          data: { title: value.title },
        })
        if (!newDocument) throw new Error('No Document returned ')
        form.reset()
        setIsOpen(false)
        queryClient.invalidateQueries({
          queryKey: ['documents', user?.id],
        })
        router.navigate({
          to: '/dashboard/document/$doc_id',
          params: {
            doc_id: newDocument.id,
          },
        })
      } catch (error) {
        toast.error('Something went wrong creating the document')
      }
    },
  })

  if (isLoading) return <DocumentsLoader />

  return (
    <>
      <div className="m-2 flex items-center justify-between md:mx-5">
        <h3 className="text-sm font-semibold md:text-base">All Documents</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex cursor-pointer items-center rounded-md bg-blue-400/50 p-2 hover:bg-blue-400"
          >
            <p className="hidden text-base md:flex">New Document</p>
            <p className="flex items-center text-xs sm:text-sm md:hidden">
              New
              <Plus className="h-3 w-3" />
            </p>
          </button>
          <SortDropdown
            sort={sortObject.sort}
            onChange={(nextSort, ascending) => {
              setPage(0)
              setSortObject({
                sort: nextSort,
                ascending,
              })
            }}
            ascending={sortObject.ascending}
          />
          <Link to="/dashboard/documents/deleted" className="hidden md:block">
            <span className="flex items-center rounded-md bg-red-400/50 p-2 hover:bg-red-400">
              <Trash size={20} className="mr-1" />
              <p className="text-xs sm:text-sm md:text-base">Trash</p>
            </span>
          </Link>
        </div>
      </div>

      <DocumentDisplay
        documents={documents}
        documentPage
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex w-full items-center justify-center backdrop-blur-sm transition-opacity duration-200 ease-out ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} `}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`transform transition-all duration-200 ease-out ${isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'} `}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="w-full space-y-5 rounded bg-gray-200/95 p-6 shadow-lg dark:bg-gray-600/95"
            >
              <form.Field
                name="title"
                children={(field) => (
                  <>
                    <input
                      value={field.state.value}
                      placeholder="Title"
                      autoFocus
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`input-field ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {field.state.meta.errors.map((error, i) => (
                      <div key={i} className="text-red-500">
                        {error}
                      </div>
                    ))}
                  </>
                )}
              />
              <button type="submit" className="button-primary">
                Create
              </button>
            </form>
          </div>
        </div>
      )}
      <Paginator setPage={setPage} page={page} totalPages={totalPages} />
    </>
  )
}
