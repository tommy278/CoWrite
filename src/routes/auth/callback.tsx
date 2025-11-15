import { createFileRoute } from '@tanstack/react-router'
import { setSessionFn } from "@/lib/serverFunctions/setSessionFn"
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
})

export default function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleOauth = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1))
      const access_token = hash.get("access_token")
      const refresh_token = hash.get("refresh_token")

      if (access_token && refresh_token ) {
        await setSessionFn({ data: {access_token, refresh_token}})
        navigate({ to: "/dashboard"})
      } else {
        console.error("No Oauth tokens found")
      }

    }
    handleOauth();
  }, [navigate])

  return <div>Redirecting...</div>
}

