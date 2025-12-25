import { Switch } from '@headlessui/react'
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { setThemeServerFn } from '@/lib/serverFunctions/themeFn'
import { useRouter } from '@tanstack/react-router'
import { Route as ParentRoute } from '@/routes/__root'

export default function DarkModeToggle() {
  const theme = ParentRoute.useLoaderData()
  const [enabled, setEnabled] = useState(theme === 'dark' ? true : false)
  const router = useRouter()
  const applyTheme = async () => {
    setThemeServerFn({ data: { mode: enabled ? 'light' : 'dark' } })
    setEnabled((prev) => !prev)
    router.invalidate({ sync: true })
  }
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
