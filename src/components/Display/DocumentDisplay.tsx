import { Document } from '@/lib/Constants/dataTypes'
import { CirclePlus } from 'lucide-react'
import { generateHTML } from '@tiptap/html'
import { extensions, extraExtensions } from '@/lib/Constants/constants'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'

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
  return (
    <div className="mt-5 grid w-full grid-cols-3 gap-4 md:grid-cols-4">
      {!isOpen && documentPage && setIsOpen && (
        <div className="flex justify-center">
          <div className="view-height rounded-md bg-cyan-300">
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
          <div className="flex justify-center" key={doc.id}>
            <Link
              to="/dashboard/document/$doc_id"
              params={{ doc_id: doc.id }}
              className="rounded-sm border border-gray-200 shadow-sm"
            >
              <div className="view-height overflow-hidden p-3">
                <div
                  id="container"
                  className="overflow-hidden text-ellipsis"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
              <div className="h-full border-t border-gray-200 px-2 py-4">
                <h1 className="header-size text-sm font-semibold">
                  {limitTextLength(doc.title)}
                </h1>
                <p className="time-size">
                  Last Updated:{' '}
                  {dayjs(documentPage ? doc.updated_at : doc.deleted_at).format(
                    'DD/MM/YYYY HH:mm'
                  )}
                </p>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
