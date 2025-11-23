import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import MobileNavbar from '@/components/Mobile/MobileNavbar'
import DesktopNavbar from '@/components/Desktop/DesktopNavbar'
import { Route as ParentRoute } from '@/routes/__root'
import { useForm } from '@tanstack/react-form'
import { updateTitleFn } from '@/lib/serverFunctions/updateTitleFn'
import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

interface HeaderProps {
  type: 'doc' | 'default'
  id?: string
  title?: string
}

export default function Header({ type, id, title }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = ParentRoute.useRouteContext()
  const router = useRouter()

  if (title === undefined) throw new Error('Title is undefined')
  console.log(id, title)

  const titleForm = useForm({
    defaultValues: {
      id,
      title,
    },
    onSubmit: async ({ value }) => {
      try {
        const title =
          value.title.trim() === '' ? 'Untitled Document' : value.title
        await updateTitleFn({
          data: { id: user.id, title },
        })
        titleForm.setFieldValue('title', title)
        router.invalidate({ sync: true })
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      }
    },
  })

  useEffect(() => {
    titleForm.setFieldValue('title', title)
    titleForm.setFieldValue('id', id)
  }, [id, title, titleForm])
  return (
    <>
      <header className="flex items-center justify-between bg-blue-900 p-4 text-white shadow-lg">
        {type === 'default' && (
          <h1 className="ml-3 text-2xl font-semibold">
            <Link to={user ? '/dashboard' : '/'}>My App</Link>
          </h1>
        )}
        {type === 'doc' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              titleForm.handleSubmit()
            }}
            className="w-full max-w-3xl"
          >
            <titleForm.Field
              name="title"
              children={(field) => (
                <>
                  <input
                    value={field.state.value}
                    autoFocus
                    name="Title"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`my-4 mb-5 ml-10 rounded-md border px-3 py-2 ${
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
