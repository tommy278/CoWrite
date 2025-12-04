interface ConfirmModalProps {
  type: 'delete' | 'confirmDelete' | 'restore' | ''
  serverFn: () => Promise<void>
}

const displayText = {
  delete: 'Delete',
  restore: 'Restore',
  confirmDelete: 'Confirm Delete',
}

export default function ConfirmModal({ type, serverFn }: ConfirmModalProps) {
  if (!type) return null
  return (
    <div
      className={`absolute top-full right-0 flex w-40 flex-col rounded-md text-sm ${type === 'delete' || type === 'confirmDelete' ? 'bg-red-300' : 'bg-blue-300'} z-50 px-4 py-2 shadow-md`}
    >
      {type === 'delete' && (
        <p>
          This document will be deleted from all documents. It will be in
          recently deleted for 30 days
        </p>
      )}
      {type === 'confirmDelete' && <p>This document will deleted forever</p>}
      {type === 'restore' && <p>Recover document</p>}
      <button onClick={serverFn} className="w-full cursor-pointer">
        {displayText[type]}
      </button>
    </div>
  )
}
