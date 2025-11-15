import { useNavigate } from '@tanstack/react-router'
import { logoutFn } from "@/lib/serverFunctions/logoutFn"
import { useUser } from "@/context/UserContext"

export default function Logout () {
    const navigate = useNavigate()
    const { setUser } = useUser()
    
    const handleLogout = async () => {
    const { error, message } = await logoutFn()
    if (error) {
      console.error(message)
    } else {
      setUser(null)
      navigate({ to: '/auth/login' })
    }
  }
    return (
    <button onClick={handleLogout}>
        Sign out
    </button>
    )
}


