import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { X, Check } from 'lucide-react'

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  useEffect(() => {
    setEnabled(document.documentElement.classList.contains('dark'))
  }, [])
  const toggleTheme = () => {
    const newIsDark = !enabled
    setEnabled(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
  if (enabled === null) return <div className="h-10 w-10" />
  return (
    <div className="flex items-center justify-center space-x-1">
      <p>Toggle Dark Mode</p>
      <Switch
        checked={enabled}
        onChange={toggleTheme}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-400/25 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
        aria-label="Toggle dark mode"
      >
        <div
          aria-hidden="true"
          className="bg-dropdown-bg pointer-events-none grid size-5 translate-x-0 rounded-full text-center shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
        >
          {!enabled ? (
            <X color="black" className="m-auto h-4 w-4" />
          ) : (
            <Check color="white" className="m-auto h-4 w-4" />
          )}
        </div>
      </Switch>
    </div>
  )
}
