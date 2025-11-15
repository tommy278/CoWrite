import { createFileRoute } from '@tanstack/react-router'
import { serialize } from 'cookie'

export const Route = createFileRoute('/api/set-session')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { access_token, refresh_token } = await request.json()

        const headers = new Headers()
        headers.append(
          'Set-Cookie',
          serialize('sb-access-token', access_token, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        )

        headers.append(
          'Set-Cookie',
          serialize('sb-refresh-token', refresh_token, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        )

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers,
        })
      },
    },
  },
})
