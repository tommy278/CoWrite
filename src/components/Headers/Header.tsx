import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowBigLeft, Menu } from 'lucide-react'
import MobileNavbar from '@/components/Mobile/MobileNavbar'
import DesktopNavbar from '@/components/Desktop/DesktopNavbar'
import { Route as ParentRoute } from '@/routes/__root'
import { useForm } from '@tanstack/react-form'
import { updateTitleFn } from '@/lib/serverFunctions/UPDATE/updateTitleFn'
import { useEffect } from 'react'
import { useIsSaving } from '@/context/isLoading'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import dayjs from 'dayjs'
import SearchBar from '../SearchBar'
import { useQuery } from '@tanstack/react-query'
import { getDocumentFn } from '@/lib/serverFunctions/GET/getDocumentFn'

interface HeaderProps {
  type: 'doc' | 'default'
  id: string
}

export default function Header({ type, id }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = ParentRoute.useRouteContext()
  const [hideSave, setHideSave] = useState(false)
  const { isSaving, handleSave, doneSaving } = useIsSaving()
  const router = useRouter()

  const isDocPage = type === 'doc' && id !== 'default'

  const { data: document } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocumentFn({ data: { id } }),
    enabled: isDocPage,
  })

  const title = document?.title ?? 'Untitled Document'
  const updated_at = document?.updated_at
  const deleted_at = document?.deleted_at

  const titleForm = useForm({
    defaultValues: {
      title: title,
    },
  })

  const debouncedUpdateTitle = useDebouncedCallback(
    async (value: string, id: string) => {
      if (document?.deleted) return
      try {
        await updateTitleFn({ data: { id, title: value } })
        router.invalidate({ sync: true })
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      } finally {
        doneSaving()
      }
    },
    { wait: 1000 }
  )

  useEffect(() => {
    if (isSaving) return
    if (titleForm.getFieldValue('title') !== title) {
      titleForm.setFieldValue('title', title)
      setHideSave(true)
    }
    const timer = setTimeout(() => {
      setHideSave(false)
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [title])

  const showSaving = !hideSave && isSaving

  if (!user) return null
  if (type === 'doc' && !document) return null

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
        {type === 'doc' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              titleForm.handleSubmit()
            }}
            className="flex max-w-3xl items-center"
          >
            <Link
              to={
                document?.deleted
                  ? '/dashboard/documents/deleted'
                  : '/dashboard/documents'
              }
            >
              <ArrowBigLeft className="mr-3 h-5 w-5 md:h-8 md:w-8" />
            </Link>
            <titleForm.Field
              name="title"
              validators={{
                onChange: async ({ value }) => {
                  handleSave()
                  debouncedUpdateTitle(value, id)
                },
                onBlur: ({ value }) => {
                  if (value.trim() === '') {
                    titleForm.setFieldValue('title', 'Untitled Document')
                  }
                },
              }}
              children={(field) => {
                return (
                  <div className="flex items-center space-x-3">
                    <input
                      value={field.state.value}
                      name="Title"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="rounded-md border px-3 py-2 text-xs sm:text-sm md:text-base"
                      disabled={document?.deleted}
                    />
                    {showSaving && !document?.deleted ? (
                      <p>Saving...</p>
                    ) : (
                      <>
                        {!document?.deleted && (
                          <p className="flex text-[clamp(10px,2vw,16px)]">
                            <span className="mr-1">Saved:</span>
                            <span className="md:hidden">
                              {dayjs(updated_at).format('MMM D, YYYY')}
                            </span>
                            <span className="hidden md:block">
                              {dayjs(updated_at).format('MMM D, YYYY h:mm A')}
                            </span>
                          </p>
                        )}
                      </>
                    )}
                    {document?.deleted && (
                      <p className="flex text-[clamp(10px,2vw,16px)]">
                        <span className="mr-1">Deleted:</span>
                        <span className="md:hidden">
                          {dayjs(deleted_at).format('MMM D, YYYY')}
                        </span>
                        <span className="hidden md:block">
                          {dayjs(deleted_at).format('MMM D, YYYY h:mm A')}
                        </span>
                      </p>
                    )}
                  </div>
                )
              }}
            />
          </form>
        )}
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
