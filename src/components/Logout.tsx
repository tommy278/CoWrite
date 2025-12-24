import { useRouter } from '@tanstack/react-router'
import { logoutFn } from '@/lib/serverFunctions/AUTH/logoutFn'
import { LogOut } from 'lucide-react'

interface LogoutProps {
  onLogout?: () => void
  className?: string
}

export default function Logout({ onLogout, className = '' }: LogoutProps) {
  const router = useRouter()
  const handleLogout = async () => {
    const { error, message } = await logoutFn()
    if (error) {
      console.error(message)
    } else {
      if (onLogout) onLogout()
      router.invalidate({ sync: true })
      router.navigate({ to: '/auth/login' })
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex cursor-pointer items-center gap-3 rounded-lg bg-red-500 p-3 transition-transform duration-150 hover:scale-105 md:gap-1 md:p-2 ${className}`}
    >
      <LogOut size={20} />
      Sign Out
    </button>
  )
}
