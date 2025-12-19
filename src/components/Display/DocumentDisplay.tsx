import { Document } from '@/lib/Constants/dataTypes'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { EllipsisVertical, Pin, X } from 'lucide-react'
import ConfirmModal from '@/components/Dropdowns/ConfirmModal'
import { useState } from 'react'
import Tiptap from '../Tiptap'

interface DocumentProps {
  documents: Document[]
  documentPage: boolean
}

export default function DocumentDisplay({
  documents,
  documentPage,
}: DocumentProps) {
  const limitTextLength = (text: string) => {
    return text.length > 30 ? text.slice(0, 30) + '...' : text
  }

  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  return (
    <div className="grid w-full grid-cols-3 md:grid-cols-4">
      {documents.map((doc) => {
        if (!doc.content)
          return (
            <div key={doc.id}>
              <p>No Content found</p>
            </div>
          )
        return (
          <div
            className="relative mx-5 my-2 flex min-w-0 flex-col"
            key={doc.id}
          >
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
              <div className="max-w-full overflow-auto">
                <Tiptap
                  value={doc.content}
                  editable={false}
                  display
                  className="view-height"
                />
              </div>

              <div className="w-full border-t border-gray-200 px-1 py-2 md:px-2 md:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h1 className="header-size text-sm font-semibold">
                      {limitTextLength(doc.title)}
                    </h1>
                    <p className="time-size">
                      Last Updated:{' '}
                      {dayjs(
                        documentPage ? doc.updated_at : doc.deleted_at
                      ).format('DD/MM/YYYY HH:mm')}
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
                    className="z-50 cursor-pointer rounded-full p-2 transition duration-200 hover:bg-gray-200"
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
