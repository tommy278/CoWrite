import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
  Outlet,
  useMatches,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { getUserFn } from '@/lib/serverFunctions/getUserFn'
import Header from '../components/Header'
import appCss from '../styles.css?url'
import { getAllDocumentsFn } from '@/lib/serverFunctions/getAllDocuments'

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
    if (user?.id === undefined) throw redirect({ to: '/' })
    const documents = await getAllDocumentsFn({ data: { user_id: user?.id } })
    return {
      user,
      documents,
      headerType: 'default' as 'default' | 'doc',
      document_id: 'default' as string,
      document_title: 'default' as string,
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
})

function RootDocument() {
  const matches = useMatches()
  const deepestMatchWithHeaderType = [...matches]
    .reverse()
    .find((m) => m.context?.headerType)

  const headerType = deepestMatchWithHeaderType?.context.headerType ?? 'default'
  const id = deepestMatchWithHeaderType?.context.document_id
  const title = deepestMatchWithHeaderType?.context.document_title

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header
          type={headerType === 'doc' ? 'doc' : 'default'}
          id={id}
          title={title}
        />
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
        <Scripts />
      </body>
    </html>
  )
}
