interface SortDropdownProps {
  sort: 'updated' | 'created'
  onChange: (sort: 'updated' | 'created') => void
}

export default function SortDropdown({ sort, onChange }: SortDropdownProps) {
  return (
    <select
      value={sort}
      onChange={(e) => onChange(e.target.value as 'updated' | 'created')}
      className="rounded-md bg-gray-300 p-1 text-sm md:p-2 md:text-base dark:bg-gray-600"
    >
      <option value="updated">Last Updated</option>
      <option value="created">Date Created</option>
    </select>
  )
}
