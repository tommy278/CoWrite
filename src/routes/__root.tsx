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
import { getAllDocumentsFn } from '@/lib/serverFunctions/GET/getAllDocuments'
import { IsSavingProvider } from '@/context/isLoading'

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
    if (!user?.id) return { user: null, documents: [] }
    const documents = await getAllDocumentsFn({ data: { user_id: user?.id } })
    return {
      user,
      documents,
      headerType: 'default' as 'default' | 'doc',
      document_id: 'default' as string,
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
  const id = deepestMatchWithHeaderType?.context.document_id ?? ''

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <IsSavingProvider>
          <Header type={headerType === 'doc' ? 'doc' : 'default'} id={id} />
          <Outlet />
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
