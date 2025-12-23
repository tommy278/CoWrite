import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context }) => {
    const user = context.user
    if (!user) {
      console.error('Auth check failed:', 400)
      throw redirect({ to: '/auth/login' })
    }
  },
})
