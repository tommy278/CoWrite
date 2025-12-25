import { createFileRoute } from '@tanstack/react-router'
import DarkModeToggle from '@/components/DarkModeToggle'
import { useState } from 'react'
import { updateDisplayNameFn } from '@/lib/serverFunctions/UPDATE/updateDisplayNameFn'
import { usePageSize } from '@/Hooks/usePageSize'
import type { PageOptions } from '@/lib/Constants/constants'
import { Select } from '@headlessui/react'
import SortDropdown from '@/components/Dropdowns/SortDropdown'
import { useSort } from '@/Hooks/useSort'
import { useQuery } from '@tanstack/react-query'
import { getDocumentStatsFn } from '@/lib/serverFunctions/GET/getDocumentStatsFn'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { PencilIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useRef, useEffect } from 'react'
import { toast } from 'sonner'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/_authed/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { profile } = Route.useRouteContext()
  const { display_name: displayName, created_at, id, updated_at } = profile!
  const [inputValue, setInputValue] = useState(displayName)
  const { pageSize, changePageSize } = usePageSize()
  const { sortObject, changeSortObject } = useSort()
  const [editable, setEditable] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus()
    }
  }, [editable])

  const handleSubmit = async () => {
    if (!inputValue.trim() || inputValue === displayName) {
      setEditable(false)
      return
    }
    const previousValue = displayName
    try {
      await updateDisplayNameFn({
        data: { id, newDisplayName: inputValue },
      })
      setEditable(false)
    } catch (err) {
      setInputValue(previousValue)
      toast.error('Failed to update display name')
    }
  }
  const { data: stats, isError } = useQuery({
    queryKey: ['document-stats'],
    queryFn: getDocumentStatsFn,
    staleTime: 1000 * 60 * 5,
  })
  if (isError) return <p>Failed to load stats</p>
  const { total = 0, active = 0, pinned = 0, deleted = 0 } = stats ?? {}
  return (
    <div className="grid-cols mx-auto my-5 grid max-w-md justify-center gap-y-4 border border-gray-300 p-10 text-gray-700 shadow-lg drop-shadow-2xl md:my-10 dark:text-white">
      <section className="grid-cols grid place-items-start gap-y-1">
        <h3 className="category">Account</h3>
        <div className="relative flex items-center">
          <input
            id="displayName"
            name="Display Name"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => handleSubmit()}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                await handleSubmit()
              }
            }}
            className={`rounded-md border px-1 ${editable && 'focus-ring cursor-text'}`}
            disabled={!editable}
          />
          <PencilIcon
            className="absolute top-1 right-1 my-auto h-4 w-4 cursor-pointer"
            onClick={() => {
              setEditable((prev) => !prev)
            }}
          />
        </div>
        <Link
          to="/auth/reset-password"
          className="flex w-full justify-center rounded-md bg-red-300 transition duration-200 hover:scale-105 hover:bg-red-400"
        >
          Reset Password
        </Link>
      </section>
      <section className="grid-cols grid place-items-start gap-y-1">
        <h3 className="category">Profile Data</h3>
        <p>Created {dayjs(created_at).fromNow()}</p>
        <p>Logged in {dayjs(updated_at).fromNow()}</p>
      </section>

      <section className="grid-cols grid place-items-start gap-y-1">
        <h3 className="category">Document Data</h3>
        <Link
          to="/dashboard/documents"
          className="underline hover:text-blue-500"
        >
          Total Documents: {total}
        </Link>
        <Link
          to="/dashboard/documents"
          className="underline hover:text-blue-500"
        >
          Active Documents: {active}
        </Link>
        <Link
          to="/dashboard/documents/pinned"
          className="underline hover:text-blue-500"
        >
          Pinned Documents: {pinned}
        </Link>
        <Link
          to="/dashboard/documents/deleted"
          className="underline hover:text-blue-500"
        >
          Deleted Documents: {deleted}
        </Link>
      </section>

      <section className="grid-cols grid place-items-start gap-y-1">
        <h3 className="category">Preferences</h3>
        <div className="flex space-x-2">
          <p>Docs per page</p>
          <Select
            value={pageSize}
            onChange={(e) =>
              changePageSize(Number(e.target.value) as PageOptions)
            }
            className="block cursor-pointer rounded-md bg-gray-300/50 hover:bg-gray-300/95 dark:bg-gray-600/50 dark:hover:bg-gray-600/95"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
            <option value={48}>48</option>
          </Select>
        </div>

        <SortDropdown
          sort={sortObject.sort}
          ascending={sortObject.ascending}
          onChange={(nextSort, ascending) => {
            changeSortObject(nextSort, ascending)
          }}
        />
        <DarkModeToggle />
      </section>
    </div>
  )
}
