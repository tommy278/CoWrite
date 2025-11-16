import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { setSessionFn } from '@/lib/serverFunctions/setSessionFn'

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
})

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleOauth = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1))
      const access_token = hash.get('access_token')
      const refresh_token = hash.get('refresh_token')

      if (access_token && refresh_token) {
        setSessionFn({ data: { access_token, refresh_token } })
        router.invalidate({ sync: true })
        router.navigate({ to: '/dashboard' })
      }
    }
    handleOauth()
  }, [router.navigate])

  return <div>Redirecting...</div>
}
