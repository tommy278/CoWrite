import { Switch } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false)
  const applyTheme = () => {
    setEnabled((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setEnabled(isDark)
  }, [])
  return (
    <div className="flex items-center justify-center space-x-1">
      <p>Toggle Dark Mode</p>
      <Switch
        checked={enabled}
        onChange={applyTheme}
        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-400/25 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white dark:bg-white/10"
        aria-label="Toggle dark mode"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none grid size-5 translate-x-0 rounded-full bg-white text-center shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
        >
          <span className="m-auto">
            {!enabled ? (
              <X color="black" className="h-4 w-4" />
            ) : (
              <Check color="black" className="h-4 w-4" />
            )}
          </span>
        </div>
      </Switch>
    </div>
  )
}
