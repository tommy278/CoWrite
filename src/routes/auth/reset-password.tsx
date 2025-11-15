import { createFileRoute } from '@tanstack/react-router';
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { supabase} from "@/lib/supabase/supabase";
import { useNavigate } from '@tanstack/react-router'
import { useUser } from "@/context/UserContext"

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
    const [sessionReady, setSessionReady ] = useState(false);
    const navigate = useNavigate()
    const { setUser } = useUser()
    
    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error fetching session:", error)
                alert("Something went wrong checking the session")
                return
            }

            if (data.session) {
                setSessionReady(true);
            } else {
                alert("Session not found. Please use the password reset link from your email.")
            }
        }
        checkSession();
    }, [])

    interface Passwords {
        newPassword: string;
        confirmPassword: string;
    }

    const defaultPasswords: Passwords = { newPassword: "", confirmPassword: ""}

    const passwordForm = useForm({
        defaultValues: defaultPasswords,
        onSubmit: async ({ value, formApi }) => {
            if (value.newPassword === value.confirmPassword) {
                const password = value.newPassword
                const { error } = await supabase.auth.updateUser({ password })
                formApi.reset()
                
                if (error) {
                    console.log(error)
                    alert("Something went wrong updating password")
                } else {
                    alert("Password successfully updated. You can log in now.")
                    setUser(null)
                    navigate({ to: "/auth/login"})
                }

            } else {
                console.error("Passwords do not match")
                alert("Passwords do not match")
                return;
            }
        }
    })

    if (!sessionReady) {
        return <p>Checking session...</p>
    }

  return (
    <form
        onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            passwordForm.handleSubmit()
        }}
        >
        <div>
            <passwordForm.Field 
                name="newPassword"
                children = {(field) => (
                    <>
                        <input
                            placeholder="New Password"
                            type="password"
                            value = {field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            />
                    </>
                )}
                />
        </div>
         <div>
            <passwordForm.Field 
                name="confirmPassword"
                children = {(field) => (
                    <>
                        <input
                            placeholder="Confirm Password"
                            type="password"
                            value = {field.state.value}
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
