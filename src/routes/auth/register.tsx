import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { supabase } from '@/lib/supabase/supabase'
import { emailSchema, passwordSchema } from '@/lib/helpers/validators'
import DesktopSignin from '@/components/Desktop/DesktopSignin'
import MobileSignin from '@/components/Mobile/MobileSignin'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

interface User {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const defaultUser: User = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function RouteComponent() {
  const form = useForm({
    defaultValues: defaultUser,
    onSubmit: async ({ value, formApi }) => {
      if (value.password === value.confirmPassword) {
        const { error } = await supabase.auth.signUp({
          email: value.email,
          password: value.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              display_name: value.name,
            },
          },
        })

        if (error) {
          alert(error.message)
        } else {
          alert('SignUp successful')
          formApi.reset()
        }
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
          Sign up with email
        </h1>
        <div>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value.length < 3
                  ? 'Name must be at least 3 characters'
                  : undefined,
            }}
            children={(field) => (
              <>
                <input
                  className={`input-field ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  autoComplete="name"
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
                  className={`input-field ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  autoComplete="email"
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
              <>
                <input
                  placeholder="Password"
                  className={`input-field ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
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
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                if (value !== form.getFieldValue('password')) {
                  return 'Passwords do not match'
                }
                return undefined
              },
            }}
            children={(field) => (
              <>
                <input
                  placeholder="Confirm Password"
                  className={`input-field ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
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

        <button className="button-primary" type="submit">
          Sign Up
        </button>
        <DesktopSignin />
        <MobileSignin text="Or sign up with" />
      </form>
    </div>
  )
}
