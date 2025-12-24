import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
  Outlet,
  useMatches,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { getUserFn } from '@/lib/serverFunctions/GET/getUserFn'
import Header from '../components/Headers/Header'
import appCss from '../styles.css?url'
import { IsSavingProvider } from '@/context/isLoading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Document } from '@/lib/Constants/dataTypes'
import { getProfileFn } from '@/lib/serverFunctions/GET/getProfileFn'
import { createProfileFn } from '@/lib/serverFunctions/POST/createProfileFn'
import { defaultName } from '@/lib/Constants/constants'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'coWrite',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => {
    const user = await getUserFn()
    if (!user?.id)
      return {
        user: null,
        headerType: 'default' as 'default' | 'doc',
        document: null as Document | null,
      }
    const profile = await getProfileFn({ data: { id: user.id } })
    if (!profile) {
      await createProfileFn({
        data: {
          id: user.id,
          display_name: defaultName,
        },
      })
    }
    return {
      user,
      profile,
      headerType: 'default' as 'default' | 'doc',
      document: null as Document | null,
    }
  },
  shellComponent: RootDocument,
  notFoundComponent: () => {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-y-10">
        <h1 className="text-5xl font-semibold">404</h1>
        <p className="text-3xl font-medium">Page not found</p>
        <Link to="/" className="text-blue-700 underline">
          Return Home
        </Link>
      </div>
    )
  },
  errorComponent: ({ error }) => {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-y-10">
        <h1>Something went wrong</h1>
        {error instanceof Error && <p>{error.message}</p>}
      </div>
    )
  },
})

function RootDocument() {
  const matches = useMatches()
  const deepestMatchWithHeaderType = [...matches]
    .reverse()
    .find((m) => m.context?.headerType)

  const headerType = deepestMatchWithHeaderType?.context.headerType ?? 'default'
  const document = deepestMatchWithHeaderType?.context.document
  const queryClient = new QueryClient()

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (() => {
              try {
                const stored = localStorage.getItem('theme')
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark')
                } else if (stored === 'light') {
                  document.documentElement.classList.remove('dark')
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark')
                }
              } catch (_) {}
          })();
      `,
          }}
        />
        <HeadContent />
      </head>
      <body className="bg-page-bg text-page-text relative transition-colors duration-300">
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand
          duration={3000}
        />
        <IsSavingProvider>
          <QueryClientProvider client={queryClient}>
            <Header
              type={headerType === 'doc' ? 'doc' : 'default'}
              document={document}
            />
            <Outlet />
          </QueryClientProvider>

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </IsSavingProvider>
        <Scripts />
      </body>
    </html>
  )
}
