import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUserFn } from '@/lib/serverFunctions/getUserFn'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const user = await getUserFn()
    if (!user) {
      console.error('Auth check failed:', 400)
      throw redirect({ to: '/auth/login' })
    }
  },
})
