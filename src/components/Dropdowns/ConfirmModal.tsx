import { softDeleteFn } from '@/lib/serverFunctions/DELETE/softDeleteFn'
import { hardDeleteFn } from '@/lib/serverFunctions/DELETE/hardDeleteFn'
import { restoreDocumentFn } from '@/lib/serverFunctions/UPDATE/restoreDocument'
import { useState } from 'react'

interface ConfirmModalProps {
  documentPage: boolean
  id: string
  onClose: () => void
}

export default function ConfirmModal({
  documentPage,
  id,
  onClose,
}: ConfirmModalProps) {
  const [type, setType] = useState<'confirmDelete' | 'restore' | ''>('')

  const serverFunctions = {
    restore: async () => await restoreDocumentFn({ data: { id } }),
    confirmDelete: async () => await hardDeleteFn({ data: { id } }),
    softDelete: async () => await softDeleteFn({ data: { id } }),
  }

  const displayText = {
    restore: 'Are you sure you want to restore the document?',
    confirmDelete: 'Deleting this means that it can no longer be recovered.',
  }

  if (documentPage) {
    return (
      <div
        className="absolute top-full right-0 z-50 mt-2 flex w-[clamp(100px,_20vw,_250px)] flex-col space-y-2 bg-gray-100 px-1 py-2 text-sm shadow-md md:text-base"
        onClick={() => onClose()}
      >
        <div className="flex flex-col">
          <p>This will be in recently deleted for 30 days</p>
          <button onClick={serverFunctions.softDelete}>Delete</button>
        </div>
      </div>
    )
  }
  return (
    <>
      {!type && (
        <div className="absolute top-full right-0 z-50 mt-2 flex w-[clamp(100px,_20vw,_250px)] flex-col space-y-2 bg-gray-100 px-1 py-2 text-xs shadow-md md:text-base">
          <button
            onClick={() => setType('confirmDelete')}
            className="cursor-pointer rounded-md bg-red-400"
          >
            Confirm Delete
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
          <p>{displayText[type]}</p>
          <div className="flex justify-center">
            <button onClick={() => onClose()} className="mr-10">
              {' '}
              Close
            </button>
            <button onClick={serverFunctions[type]}>
              {type === 'confirmDelete'
                ? 'Delete Permanently'
                : 'Restore Document'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
