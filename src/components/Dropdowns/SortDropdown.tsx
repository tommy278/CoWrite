import { Select } from '@headlessui/react'

interface SortDropdownProps {
  sort: 'updated' | 'created'
  ascending: boolean
  onChange: (sort: 'updated' | 'created', ascending: boolean) => void
  deleted?: boolean
}

export default function SortDropdown({
  sort,
  onChange,
  ascending,
  deleted = false,
}: SortDropdownProps) {
  return (
    <Select
      value={`${sort}-${ascending ? 'asc' : 'desc'}`}
      onChange={(e) => {
        const [nextSort, dir] = e.target.value.split('-')
        onChange(nextSort as 'updated' | 'created', dir === 'asc')
      }}
      className="hover:bg-hover-bg bg-dropdown-bg cursor-pointer rounded-md px-1 py-2 text-xs sm:text-sm md:text-base"
    >
      <option value="updated-desc">
        {!deleted ? 'Last Updated' : 'Last Deleted'} (Newest)
      </option>
      <option value="updated-asc">
        {!deleted ? 'Last Updated' : 'Last Deleted'} (Oldest)
      </option>
      <option value="created-desc">Date Created (Newest)</option>
      <option value="created-asc">Date Created (Oldest)</option>
    </Select>
  )
}
