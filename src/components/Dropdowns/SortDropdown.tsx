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
    <select
      value={`${sort}-${ascending ? 'asc' : 'desc'}`}
      onChange={(e) => {
        const [nextSort, dir] = e.target.value.split('-')
        onChange(nextSort as 'updated' | 'created', dir === 'asc')
      }}
      className="cursor-pointer rounded-md bg-gray-300/50 px-1 py-2 text-xs hover:bg-gray-300/95 sm:text-sm md:text-base dark:bg-gray-600/50 dark:hover:bg-gray-600/95"
    >
      <option value="updated-desc">
        {!deleted ? 'Last Updated' : 'Last Deleted'} (Newest)
      </option>
      <option value="updated-asc">
        {!deleted ? 'Last Updated' : 'Last Deleted'} (Oldest)
      </option>
      <option value="created-desc">Date Created (Newest)</option>
      <option value="created-asc">Date Created (Oldest)</option>
    </select>
  )
}
