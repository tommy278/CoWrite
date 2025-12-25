import { Document } from '@/lib/Constants/dataTypes'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { EllipsisVertical, Pin, X } from 'lucide-react'
import ConfirmModal from '@/components/Dropdowns/ConfirmModal'
import { useState } from 'react'
import Tiptap from '../Tiptap'
import relativeTime from 'dayjs/plugin/relativeTime'

interface DocumentProps {
  documents: Document[]
  documentPage?: boolean
  deletedPage?: boolean
  pinnedPage?: boolean
  onClick?: () => void
}

export default function DocumentDisplay({
  documents,
  documentPage,
  onClick,
  deletedPage,
  pinnedPage,
}: DocumentProps) {
  const limitTextLength = (text: string) => {
    return text.length > 30 ? text.slice(0, 30) + '...' : text
  }

  if (documents.length < 1 && documentPage) {
    return (
      <div className="text-muted-foreground mt-20 flex flex-col items-center gap-2 text-center">
        <p className="text-sm">You don’t have any documents yet.</p>
        <p className="text-xs">
          Click{' '}
          <button
            type="button"
            onClick={onClick}
            className="text-foreground focus-visible:ring-ring cursor-pointer rounded-sm font-medium hover:underline focus:outline-none focus-visible:ring-2"
          >
            New Document
          </button>{' '}
          to get started.
        </p>
      </div>
    )
  }

  if (documents.length < 1 && pinnedPage && documentPage) {
    return (
      <div className="text-muted-foreground mt-20 flex flex-col items-center gap-2 text-center">
        <p className="text-sm">No pinned documents.</p>
        <p className="text-xs">Pin documents to keep them easy to find.</p>
      </div>
    )
  }

  if (documents.length < 1 && deletedPage) {
    return (
      <div className="text-muted-foreground mt-20 flex flex-col items-center gap-2 text-center">
        <p className="text-sm">Trash is empty.</p>
        <p className="text-xs">Deleted documents will appear here.</p>
      </div>
    )
  }

  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  dayjs.extend(relativeTime)
  return (
    <div className="grid w-full grid-cols-3 gap-2 px-5 md:grid-cols-4 md:gap-5">
      {documents.map((doc) => {
        if (!doc.content)
          return (
            <div key={doc.id}>
              <p>No Content found</p>
            </div>
          )
        return (
          <div className="relative my-2 flex min-w-0 flex-col" key={doc.id}>
            <Link
              to={`${documentPage ? '/dashboard/document/$doc_id' : '/dashboard/document/deleted/$doc_id'}`}
              params={{ doc_id: doc.id }}
              className="rounded-sm border border-gray-200 shadow-sm hover:border-blue-300"
            >
              {doc.pinned && !doc.deleted && (
                <div className="absolute top-0 right-0 m-1">
                  <Pin color="blue" className="icon" />
                </div>
              )}
              <div className="view-height overflow-hidden" id="container">
                <Tiptap
                  value={doc.content}
                  editable={false}
                  display
                  className="h-full w-full"
                />
              </div>
              <div className="w-full border-t border-gray-200 px-1 py-2 md:px-2 md:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h1 className="header-size text-sm font-semibold">
                      {limitTextLength(doc.title)}
                    </h1>
                    <p className="time-size">
                      <span className="mr-0.5 md:mr-1">
                        {doc.deleted ? 'Deleted' : 'Last updated'}
                      </span>
                      {dayjs(
                        documentPage ? doc.updated_at : doc.deleted_at
                      ).fromNow()}
                    </p>
                  </div>
                  <button
                    aria-label="Open Menu"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveDocId((prev) =>
                        prev === doc.id ? null : doc.id
                      )
                    }}
                    className="z-50 cursor-pointer rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {activeDocId === doc.id ? (
                      <X className="icon" />
                    ) : (
                      <EllipsisVertical className="icon" />
                    )}
                  </button>
                </div>
              </div>
            </Link>
            {activeDocId === doc.id && (
              <ConfirmModal
                documentPage={!doc.deleted}
                id={doc.id}
                onClose={() => setActiveDocId(null)}
                pinned={doc.pinned}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
