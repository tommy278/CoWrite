import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { getDocumentFn } from '@/lib/serverFunctions/GET/getDocumentFn'
import { updateContentFormFn } from '@/lib/serverFunctions/UPDATE/updateContentFormFn'
import Tiptap from '@/components/Tiptap'
import { useIsSaving } from '@/context/isLoading'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import type { JSONContent } from '@tiptap/core'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authed/dashboard/document/$doc_id')({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const document = await getDocumentFn({
      data: { id: params.doc_id },
    })
    return {
      ...context,
      document,
      headerType: 'doc',
    }
  },
})

function RouteComponent() {
  const { handleSave, doneSaving } = useIsSaving()
  const { document } = Route.useRouteContext()
  if (!document) return <p>Document not found</p>

  const contentForm = useForm({
    defaultValues: {
      id: document.id,
      content: document.content ?? { type: 'doc', content: [] },
    },
  })

  const debouncedContentUpdate = useDebouncedCallback(
    async (id: string, content: JSONContent) => {
      try {
        await updateContentFormFn({ data: { id, content } })
      } catch (error) {
        toast.error('Something went wrong')
      } finally {
        doneSaving()
      }
    },
    { wait: 1000 }
  )

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          contentForm.handleSubmit()
        }}
        className="flex w-full flex-col justify-center"
      >
        <contentForm.Field
          name="content"
          validators={{
            onChange: async ({ value }) => {
              handleSave()
              debouncedContentUpdate(document.id, value)
            },
          }}
          children={(field) => {
            return (
              <Tiptap
                value={field.state.value as JSONContent}
                onChange={(json: JSONContent) => field.handleChange(json)}
                editable
              />
            )
          }}
        />
      </form>
    </>
  )
}
