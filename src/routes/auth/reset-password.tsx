import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { passwordSchema } from '@/lib/helpers/validators'
import { updateUserFn } from '@/lib/serverFunctions/UPDATE/updateUserFn'
import { toast } from 'sonner'

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
      try {
        if (value.newPassword !== value.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        await updateUserFn({ data: { password: value.newPassword } })
        toast.success('Password updated! Please log in.')
        router.invalidate({ sync: true })
        router.navigate({ to: '/auth/login' })
      } catch (error) {
        console.error(error)
        toast.error('Password reset unsuccessful.')
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center">
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
