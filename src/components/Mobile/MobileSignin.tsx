import { oauthSigninFn } from '@/lib/serverFunctions/oauthSigninFn'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function MobileSignin({ text }: { text: string }) {
  return (
    <div className="md:hidden">
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 flex-shrink text-sm text-gray-400">{text}</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex justify-between">
        <button
          className="inline-flex cursor-pointer rounded-md bg-blue-500 px-10 py-3"
          type="button"
          onClick={async () => {
            const { url } = await oauthSigninFn({ data: 'google' })
            window.location.href = url
          }}
        >
          <FcGoogle size={20} />
        </button>

        <button
          type="button"
          className="inline-flex cursor-pointer rounded-md bg-gray-400 p-2 px-10 py-3"
          onClick={async () => {
            const { url } = await oauthSigninFn({ data: 'github' })
            window.location.href = url
          }}
        >
          <FaGithub size={20} />
        </button>
      </div>
    </div>
  )
}
