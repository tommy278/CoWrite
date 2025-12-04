import { Document } from '@/lib/Constants/dataTypes'

export const sortDocuments = (
  setOrderedDocuments: React.Dispatch<React.SetStateAction<Document[]>>,
  field: 'updated_at' | 'deleted_at',
  direction: 'asc' | 'desc'
) => {
  setOrderedDocuments((prev) =>
    [...prev].sort((a, b) => {
      const diff =
        new Date(a[field] ?? 0).getTime() - new Date(b[field] ?? 0).getTime()
      return direction === 'asc' ? diff : -diff
    })
  )
}

export const sortAlphabetically = (
  setOrderedDocuments: React.Dispatch<React.SetStateAction<Document[]>>
) => {
  setOrderedDocuments((prev) =>
    [...prev].sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    )
  )
}
