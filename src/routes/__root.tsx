import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
  Outlet,
  useMatches,
} from '@tanstack/react-router'
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
import { getThemeServerFn } from '@/lib/serverFunctions/themeFn'

const queryClient = new QueryClient()

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
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
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
  loader: () => getThemeServerFn(),
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
  const theme = Route.useLoaderData()

  const headerType = deepestMatchWithHeaderType?.context.headerType ?? 'default'
  const document = deepestMatchWithHeaderType?.context.document

  return (
    <html lang="en" className={theme ?? ''} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-page-bg text-page-text relative transition-colors duration-300">
        <QueryClientProvider client={queryClient}>
          <IsSavingProvider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand
              duration={3000}
            />
            <Header
              type={headerType === 'doc' ? 'doc' : 'default'}
              document={document}
            />
            <Outlet />
          </IsSavingProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
