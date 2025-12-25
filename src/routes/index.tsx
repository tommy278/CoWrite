import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
  beforeLoad: async ({ context }) => {
    const user = context.user
    if (user) {
      throw redirect({ to: '/dashboard/documents' })
    }
  },
})

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-6 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl text-center">
        <h1 className="animate-fade-in mb-4 text-6xl font-extrabold text-blue-600 sm:text-7xl dark:text-blue-400">
          Welcome to{' '}
          <span className="text-blue-500 dark:text-blue-300">coWrite</span>
        </h1>
        <p className="mb-8 text-lg text-gray-700 sm:text-xl dark:text-gray-300">
          Create, organize, and manage your documents easily. coWrite makes it
          simple to keep track of your work and stay productive.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/auth/register"
            className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:scale-105 hover:bg-blue-400 dark:text-blue-300"
          >
            Get Started
          </Link>
          <Link
            to="/auth/login"
            className="rounded-lg border border-blue-300 bg-white px-6 py-3 font-semibold text-blue-500 shadow-md transition duration-200 hover:scale-105 hover:bg-blue-50 dark:text-blue-300"
          >
            Log In
          </Link>
        </div>
      </div>
      <footer className="mt-20 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} coWrite. All rights reserved.
      </footer>
    </div>
  )
}
