import { createFileRoute } from '@tanstack/react-router';
import { useForm } from "@tanstack/react-form";
import { supabase } from "@/lib/supabase/supabase";

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

interface User{
  name: string;
  email: string;
  password: string;
}

const defaultUser: User = { name: '', email: '', password: ''}

function RouteComponent() {
  const form = useForm({
    defaultValues: defaultUser,
    onSubmit: async ({value, formApi})  => {
      console.log(value)
      const { error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password
      })

      if (error) {
        alert(error.message) 
      } else {
        alert("SignUp successful")
        formApi.reset()
      }
    },
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
            name="name"
            validators = {{
              onChange: ({ value }) =>
                value.length < 3 ? "Name must be longer than 3": undefined
            }}
            children = {(field) => (
              <>
                <input
                  placeholder="Name"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
        </div>
        <div>
          <form.Field 
            name="password"
            validators = {{
              onChange: ({ value }) => 
                value.length < 5 ? "Password not long enough": undefined
            }}
            children = {(field) => (
              <>
                <input
                  placeholder="Password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          />
        </div>
        <div>
          <form.Field 
            name="email"
            validators = {{
              onChange: ({value}) => 
                !value.includes('@') ? "email must include @": undefined
            }}
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
        <button type="submit">Sign Up</button>
      </form>
    )
}
