import { useEffect, useState } from 'react'

interface SortObject {
  sort: 'updated' | 'created'
  ascending: boolean
}

export function useSort() {
  const [sortObject, setSortObject] = useState<SortObject>({
    sort: 'updated',
    ascending: false,
  })
  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedSortObject = JSON.parse(
      localStorage.getItem('DOC_SORT')!
    ) as SortObject
    if (storedSortObject) setSortObject(storedSortObject)
  }, [])
  const changeSortObject = (
    sort = sortObject.sort,
    ascending = sortObject.ascending
  ) => {
    const newSortObject = { sort, ascending }
    setSortObject(newSortObject)
    localStorage.setItem('DOC_SORT', JSON.stringify(newSortObject))
  }
  return { sortObject, setSortObject, changeSortObject }
}
