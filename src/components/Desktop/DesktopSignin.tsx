import { supabase } from '@/lib/supabase/supabase'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { callbackUrl } from '@/lib/constants'

export default function DesktopSignin() {
  return (
    <div className="hidden md:block">
      <div className="flex justify-between">
        <button
          className="inline-flex cursor-pointer rounded-md bg-blue-500 p-2"
          type="button"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: callbackUrl,
              },
            })
          }}
        >
          <FcGoogle size={20} />
          <span className="ml-1 text-gray-200">Log in with Google</span>
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer rounded-md bg-gray-400 p-2"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: 'github',
              options: {
                redirectTo: callbackUrl,
              },
            })
          }}
        >
          <FaGithub size={20} />
          <span className="ml-1 text-gray-200">Log in with Github</span>
        </button>
      </div>
    </div>
  )
}
