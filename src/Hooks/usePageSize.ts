import type { PageOptions } from '@/lib/Constants/constants'
import { useState, useEffect } from 'react'

export function usePageSize() {
  const [pageSize, setPageSize] = useState<PageOptions>(24)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedPageSize = Number(
      localStorage.getItem('PAGE_SIZE')
    ) as PageOptions
    if ([12, 24, 36, 48].includes(storedPageSize)) setPageSize(storedPageSize)
  }, [])
  const changePageSize = (number: PageOptions) => {
    setPageSize(number)
    localStorage.setItem('PAGE_SIZE', String(number))
  }
  return { pageSize, changePageSize }
}
