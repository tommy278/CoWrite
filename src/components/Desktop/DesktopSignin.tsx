import { oauthSigninFn } from '@/lib/serverFunctions/oauthSigninFn'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function DesktopSignin() {
  return (
    <div className="hidden md:block">
      <div className="flex justify-between">
        <button
          className="inline-flex cursor-pointer rounded-md bg-blue-500 p-2"
          type="button"
          onClick={async () => {
            const { url } = await oauthSigninFn({ data: 'google' })
            window.location.href = url
          }}
        >
          <FcGoogle size={20} />
          <span className="ml-1 text-gray-200">Log in with Google</span>
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer rounded-md bg-gray-400 p-2"
          onClick={async () => {
            const { url } = await oauthSigninFn({ data: 'github' })
            window.location.href = url
          }}
        >
          <FaGithub size={20} />
          <span className="ml-1 text-gray-200">Log in with Github</span>
        </button>
      </div>
    </div>
  )
}
