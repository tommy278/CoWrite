import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { supabase } from '@/lib/supabase/supabase'
import { emailSchema } from '@/lib/helpers/validators'

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value, formApi }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(value.email, {
        redirectTo: 'http://localhost:3000/auth/reset-password',
      })
      if (error) {
        alert(error.message)
      } else {
        alert('Password reset email sent. Check your inbox.')
        formApi.reset()
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
          Reset password with email
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
