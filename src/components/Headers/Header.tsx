import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import MobileNavbar from '@/components/Mobile/MobileNavbar'
import DesktopNavbar from '@/components/Desktop/DesktopNavbar'
import { Route as ParentRoute } from '@/routes/__root'
import { useForm } from '@tanstack/react-form'
import { updateTitleFn } from '@/lib/serverFunctions/UPDATE/updateTitleFn'
import { useEffect } from 'react'
import { useIsSaving } from '@/context/isLoading'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { ArrowLeft } from 'lucide-react'
import dayjs from 'dayjs'
import SearchBar from '../SearchBar'

interface HeaderProps {
  type: 'doc' | 'default'
  id: string
}

export default function Header({ type, id }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, documents } = ParentRoute.useRouteContext()
  const [hideSave, setHideSave] = useState(false)
  const { isSaving, handleSave, doneSaving } = useIsSaving()
  const router = useRouter()

  const document = documents.find((document) => document.id === id)
  const title = document?.title ?? 'Untitled Document'
  const updated_at = document?.updated_at

  const titleForm = useForm({
    defaultValues: {
      title,
    },
  })

  const debouncedUpdateTitle = useDebouncedCallback(
    async (value: string, id: string) => {
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
    { wait: 3000 }
  )

  useEffect(() => {
    if (titleForm.getFieldValue('title') !== title) {
      titleForm.setFieldValue('title', title)
      setHideSave(true)
    }
    const timer = setTimeout(() => {
      setHideSave(false)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [title])

  const showSaving = !hideSave && isSaving

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-blue-900 pr-4 text-white shadow-lg">
        {type === 'default' && (
          <h1
            className={`${user ? 'w-[80%]' : 'w-[50%]'} my-5 ml-5 flex items-center justify-between gap-4 text-2xl font-semibold`}
          >
            <Link to={user ? '/dashboard' : '/'}>coWrite</Link>
            {user && <SearchBar documents={documents} className="text-base" />}
          </h1>
        )}
        {type === 'doc' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              titleForm.handleSubmit()
            }}
            className="ml-4 flex w-full max-w-3xl items-center"
          >
            <Link to="/dashboard">
              <ArrowLeft className="btn-format mr-3" />
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
                      autoFocus
                      name="Title"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="my-4 mb-5 rounded-md border px-3 py-2"
                    />
                    {showSaving ? (
                      <p>Saving...</p>
                    ) : (
                      <p className="hidden md:block">
                        Saved at {dayjs(updated_at).format('DD/MM/YYYY HH:mm')}
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
