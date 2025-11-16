import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { supabase } from '@/lib/supabase/supabase'
import { passwordSchema } from '@/lib/helpers/validators'

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  interface Passwords {
    newPassword: string
    confirmPassword: string
  }

  const defaultPasswords: Passwords = { newPassword: '', confirmPassword: '' }

  const passwordForm = useForm({
    defaultValues: defaultPasswords,
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      const { error } = await supabase.auth.updateUser({
        password: value.newPassword,
      })

      if (error) {
        alert('Something went wrong. Please try logging in again')
        console.error(error)
        return
      }

      alert('Password updated! Please log in.')
      router.invalidate({ sync: true })
      router.navigate({ to: '/auth/login' })
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          passwordForm.handleSubmit()
        }}
        className="form-content"
      >
        <h1 className="flex justify-center text-3xl font-semibold">
          Reset password
        </h1>
        <div>
          <passwordForm.Field
            name="newPassword"
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
                  placeholder="New Password"
                  type="password"
                  autoComplete="new-password"
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
          <passwordForm.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                if (value !== passwordForm.getFieldValue('newPassword')) {
                  return 'Passwords do not match'
                }
                return undefined
              },
            }}
            children={(field) => (
              <>
                <input
                  placeholder="Confirm Password"
                  type="password"
                  autoComplete="new-password"
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
        <button type="submit" className="button-primary">
          Reset Password
        </button>
      </form>
    </div>
  )
}
