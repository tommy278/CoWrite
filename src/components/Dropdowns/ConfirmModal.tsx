import { softDeleteFn } from '@/lib/serverFunctions/DELETE/softDeleteFn'
import { hardDeleteFn } from '@/lib/serverFunctions/DELETE/hardDeleteFn'
import { restoreDocumentFn } from '@/lib/serverFunctions/UPDATE/restoreDocument'
import { pinDocumentFn } from '@/lib/serverFunctions/UPDATE/pinDocumentFn'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { clickDetector } from '@/context/clickDetector'
import { Pin, Trash } from 'lucide-react'

interface ConfirmModalProps {
  documentPage: boolean
  id: string
  onClose: () => void
  pinned: boolean
}

export default function ConfirmModal({
  documentPage,
  id,
  onClose,
  pinned,
}: ConfirmModalProps) {
  const [type, setType] = useState<'confirmDelete' | 'restore' | ''>('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const router = useRouter()

  const serverFunctions = {
    restore: async () => {
      await restoreDocumentFn({ data: { id } })
      onClose()
      router.navigate({ to: '/dashboard/documents' })
    },
    confirmDelete: async () => {
      await hardDeleteFn({ data: { id } })
      onClose()
      router.navigate({ to: '/dashboard/documents/deleted' })
    },
    softDelete: async () => {
      await softDeleteFn({ data: { id } })
      onClose()
      router.invalidate({ sync: true })
    },
    pinDocument: async () => {
      await pinDocumentFn({ data: { id, pinned } })
      onClose()
      router.invalidate({ sync: true })
    },
  }

  const displayText = {
    restore: 'Restore this document? It’ll return to your main documents list.',
    confirmDelete:
      'Permanently delete this document? You won’t be able to get it back.',
  }

  const ref = clickDetector(() => onClose())

  if (documentPage && isDeleteOpen) {
    return (
      <div className="confirm-modal" ref={ref}>
        <div className="flex flex-col space-y-1 md:space-y-2">
          <p>This will be in recently deleted for 30 days</p>
          <button
            onClick={serverFunctions.softDelete}
            className="w-full cursor-pointer rounded-md bg-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    )
  } else if (documentPage && !isDeleteOpen) {
    return (
      <div className="confirm-modal" ref={ref}>
        <div className="flex flex-col space-y-1 md:space-y-2">
          <button
            onClick={serverFunctions.pinDocument}
            className="flex cursor-pointer items-center justify-center rounded-md bg-blue-400 py-1"
          >
            <Pin className="mr-1 h-4 w-4" />
            {!pinned ? 'Pin' : 'Unpin'}
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex cursor-pointer items-center justify-center rounded-md bg-red-400 py-1"
          >
            <Trash className="mr-1 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    )
  }
  return (
    <>
      {!type && (
        <div className="confirm-modal" ref={ref}>
          <button
            onClick={() => setType('confirmDelete')}
            className="cursor-pointer rounded-md bg-red-400"
          >
            Remove
          </button>
          <button
            onClick={() => setType('restore')}
            className="cursor-pointer rounded-md bg-blue-400"
          >
            Restore
          </button>
        </div>
      )}

      {type && (
        <div
          className="fixed inset-0 z-50 flex w-full flex-col items-center justify-center bg-black/20"
          onClick={() => onClose()}
        >
          <div className="w-auto max-w-[90%] min-w-[50%] rounded-md bg-gray-100 px-5 py-10 text-sm md:text-base">
            <p className="mb-2">{displayText[type]}</p>
            <div className="flex justify-between">
              <button
                onClick={() => onClose()}
                className="cursor-pointer rounded-md bg-white p-2 shadow-md"
              >
                Close
              </button>
              <button
                onClick={serverFunctions[type]}
                className={`cursor-pointer rounded-md ${type === 'confirmDelete' ? 'bg-red-400' : 'bg-blue-400'} p-2 shadow-md`}
              >
                {type === 'confirmDelete'
                  ? 'Delete Permanently'
                  : 'Restore Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
