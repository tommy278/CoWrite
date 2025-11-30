import { createFileRoute, redirect } from '@tanstack/react-router'
import { exchangeCodeFn } from '@/lib/serverFunctions/AUTH/exchangeCodeFn'

export const Route = createFileRoute('/auth/callback')({
  loader: async ({ location }) => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')
    if (!code) {
      throw redirect({ to: '/' })
    }
    await exchangeCodeFn({ data: { code } })
    throw redirect({ to: '/dashboard' })
  },
  component: () => <p>Redirecting...</p>,
})
