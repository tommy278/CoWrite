import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context }) => {
    const user = context.user
    const profile = context.profile
    if (!user || !profile) {
      throw redirect({ to: '/auth/login' })
    }
  },
})
