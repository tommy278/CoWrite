import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { loginFn } from '@/lib/serverFunctions/loginFn'
import { Link } from '@tanstack/react-router'
import { emailSchema, passwordSchema } from '@/lib/helpers/validators'
import DesktopSignin from '@/components/Desktop/DesktopSignin'
import MobileSignin from '@/components/Mobile/MobileSignin'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

interface User {
  email: string
  password: string
}

const loggedInUser: User = { email: '', password: '' }

function RouteComponent() {
  const router = useRouter()

  const form = useForm({
    defaultValues: loggedInUser,
    onSubmit: async ({ value }) => {
      console.log(value)
      const { error, message } = await loginFn({
        data: {
          email: value.email,
          password: value.password,
        },
      })
      if (error) {
        alert(message)
        console.error(message)
      } else {
        alert(message)
        router.invalidate({ sync: true })
        router.navigate({ to: '/dashboard' })
      }
    },
  })
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="form-content"
      >
        <h1 className="flex justify-center text-3xl font-semibold">
          Sign in with email
        </h1>
        <div>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = emailSchema.safeParse(value)
                return result.success
                  ? undefined
                  : result.error.errors[0].message
              },
            }}
            children={(field) => (
              <>
                <input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`input-field ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {field.state.meta.errors.map((error, i) => (
                  <div key={i} className="text-red-500">
                    {error}
                  </div>
                ))}
              </>
            )}
          />
        </div>
        <div>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                const result = passwordSchema.safeParse(value)
                return result.success
                  ? undefined
                  : result.error.errors[0].message
              },
            }}
            children={(field) => (
              <div>
                <input
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`input-field ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {field.state.meta.errors.map((error, i) => (
                  <div key={i} className="text-red-500">
                    {error}
                  </div>
                ))}
              </div>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Link to="/auth/forgot-password" className="text-blue-400">
            Forgot Password?
          </Link>
        </div>

        <div className="button-primary flex justify-center">
          <button type="submit">Log in</button>
        </div>

        <DesktopSignin />
        <MobileSignin text="Or sign in with" />

        <div className="flex justify-center">
          <span className="mr-1">Don't have an account yet?</span>
          <Link to="/auth/register" className="text-blue-500">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
}
