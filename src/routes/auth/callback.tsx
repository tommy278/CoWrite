import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { exchangeCodeFn } from '@/lib/serverFunctions/AUTH/exchangeCodeFn'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/callback')({
  loader: async ({ location }) => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')
    if (!code) {
      throw redirect({ to: '/' })
    }
    await exchangeCodeFn({ data: { code } })
    throw redirect({ to: '/dashboard/documents' })
  },
  component: () => CallbackComponent,
})

function CallbackComponent() {
  const router = useRouter()
  useEffect(() => {
    router.invalidate({ sync: true })
  }, [])
}
