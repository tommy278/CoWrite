import { useIsSaving } from '@/context/isLoading'
import { useForm } from '@tanstack/react-form'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ArrowBigLeft } from 'lucide-react'
import { updateTitleFn } from '@/lib/serverFunctions/UPDATE/updateTitleFn'
import { useEffect, useState } from 'react'
import { Document } from '@/lib/Constants/dataTypes'
import { toast } from 'sonner'

export default function DocHeader({
  document,
}: {
  document: Document | null | undefined
}) {
  const { isSaving, handleSave, doneSaving } = useIsSaving()
  const {
    id = '',
    title = 'Untitled Document',
    deleted_at = null,
    updated_at = null,
    deleted = false,
  } = document ?? {}

  const [hideSave, setHideSave] = useState(false)
  const titleForm = useForm({
    defaultValues: {
      title: title,
    },
  })

  const debouncedUpdateTitle = useDebouncedCallback(
    async (value: string, id: string) => {
      if (deleted) return
      try {
        await updateTitleFn({ data: { id, title: value } })
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong')
      } finally {
        doneSaving()
      }
    },
    { wait: 1000 }
  )

  const showSaving = !hideSave && isSaving

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
  }, [document?.id])
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        titleForm.handleSubmit()
      }}
      className="flex max-w-3xl items-center"
    >
      <Link
        to={deleted ? '/dashboard/documents/deleted' : '/dashboard/documents'}
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
                disabled={deleted}
              />
              {showSaving && !deleted ? (
                <p>Saving...</p>
              ) : (
                <>
                  {!deleted && (
                    <p className="flex text-[clamp(10px,2vw,16px)]">
                      <span className="mr-1">Saved</span>
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
                  <span className="mr-1">Deleted</span>
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
  )
}
