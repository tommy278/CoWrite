import { Document } from '@/lib/Constants/dataTypes'
import { CirclePlus, Pin } from 'lucide-react'
import { generateHTML } from '@tiptap/html'
import { extensions, extraExtensions } from '@/lib/Constants/constants'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { EllipsisVertical, X } from 'lucide-react'
import ConfirmModal from '@/components/Dropdowns/ConfirmModal'
import { useState } from 'react'

interface DocumentProps {
  isOpen?: boolean
  documents: Document[]
  setIsOpen?: (state: boolean) => void
  documentPage: boolean
}

export default function DocumentDisplay({
  isOpen,
  documents,
  setIsOpen,
  documentPage,
}: DocumentProps) {
  const allExtensions = [...extensions, ...extraExtensions]

  const limitTextLength = (text: string) => {
    return text.length > 30 ? text.slice(0, 30) + '...' : text
  }

  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  return (
    <div className="grid w-full grid-cols-3 md:grid-cols-4">
      {!isOpen && documentPage && setIsOpen && (
        <div className="flex hidden justify-center">
          <div className="view-height rounded-sm bg-cyan-300">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-full w-full cursor-pointer items-center justify-center"
            >
              <CirclePlus id="icon" />
            </button>
          </div>
        </div>
      )}
      {documents.map((doc) => {
        if (!doc.content)
          return (
            <div key={doc.id}>
              <p>No Content found</p>
            </div>
          )
        const htmlContent = generateHTML(doc.content, allExtensions)
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
              <div className="view-height overflow-hidden p-3">
                <div
                  id="container"
                  className="overflow-hidden text-ellipsis"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
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
