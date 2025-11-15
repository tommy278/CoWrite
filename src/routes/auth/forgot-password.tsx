import { createFileRoute } from '@tanstack/react-router'
import { useForm } from "@tanstack/react-form";
import { supabase } from "@/lib/supabase/supabase";

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
    const form = useForm({
        defaultValues: {email: ""},
        onSubmit: async ({value, formApi}) => {
            const {error} = await supabase.auth.resetPasswordForEmail(
                value.email, 
                { redirectTo: "http://localhost:3000/auth/reset-password"}
            )
            if (error) {
                alert(error.message) 
            } else {
                alert("Password reset email sent. Check your inbox.")
                formApi.reset()
            }
        }
    })
  return (
    <form
        onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
        }} 
        >
            <div>
                <form.Field 
                    name="email"
                    children = {(field) => (
                        <>
                            <input 
                                placeholder="Email"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                />
                        </>
                    )}
                    />
            </div>
            <button type="submit">Reset Password</button>
    </form>
  )
}
