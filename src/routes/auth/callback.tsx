import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { exchangeCodeFn } from '@/lib/serverFunctions/AUTH/exchangeCodeFn'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/callback')({
  loader: async ({ location }) => {
    const search = new URLSearchParams(location.search)
    const code = search.get('code')
    if (!code) throw redirect({ to: '/' })
    if (typeof window === 'undefined') {
      await exchangeCodeFn({ data: { code } })
      throw redirect({ to: '/dashboard/documents' })
    }
  },
  component: () => CallbackComponent,
})

function CallbackComponent() {
  const router = useRouter()
  useEffect(() => {
    router.invalidate({ sync: true })
  }, [])
}
