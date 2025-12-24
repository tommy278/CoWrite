import { createFileRoute } from '@tanstack/react-router'
import DarkModeToggle from '@/components/DarkModeToggle'
import { useState } from 'react'
import { updateDisplayNameFn } from '@/lib/serverFunctions/UPDATE/updateDisplayNameFn'
import Logout from '@/components/Logout'
import { usePageSize } from '@/Hooks/usePageSize'
import type { PageOptions } from '@/lib/Constants/constants'
import { Select } from '@headlessui/react'

export const Route = createFileRoute('/_authed/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { profile } = Route.useRouteContext()
  const { display_name: displayName, created_at, id, updated_at } = profile!
  const [inputValue, setInputValue] = useState(displayName)
  const { pageSize, changePageSize } = usePageSize()

  const handleSubmit = async () => {
    if (!inputValue.trim()) return
    const previousValue = displayName
    try {
      await updateDisplayNameFn({
        data: { id, newDisplayName: inputValue },
      })
    } catch (err) {
      setInputValue(previousValue)
      alert('Failed to update display name')
    }
  }
  return (
    <>
      <input
        id="displayName"
        name="Display Name"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => handleSubmit()}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            await handleSubmit()
          }
        }}
      />
      <p>created:{created_at.toLocaleString()}</p>
      <p>Logged in: {updated_at.toLocaleString()}</p>
      <DarkModeToggle />
      <Select
        value={pageSize}
        onChange={(e) => changePageSize(Number(e.target.value) as PageOptions)}
      >
        <option value={12}>12</option>
        <option value={24}>24</option>
        <option value={36}>36</option>
        <option value={48}>48</option>
      </Select>
      <Logout className="text-white" />
    </>
  )
}
