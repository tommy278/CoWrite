import { Document } from '@/lib/Constants/dataTypes'

export const sortAscending = (
  setOrderedDocuments: React.Dispatch<React.SetStateAction<Document[]>>
) => {
  setOrderedDocuments((prev) =>
    [...prev].sort(
      (a, b) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    )
  )
}

export const sortDescending = (
  setOrderedDocuments: React.Dispatch<React.SetStateAction<Document[]>>
) => {
  setOrderedDocuments((prev) =>
    [...prev].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
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
