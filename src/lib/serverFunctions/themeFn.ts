import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

type Theme = 'dark' | 'light'

const storageKey = 'ui-theme'

export const getThemeServerFn = createServerFn().handler(async () => {
  return (getCookie(storageKey) || 'light') as Theme
})

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ mode: z.enum(['light', 'dark']) }))
  .handler(async ({ data }) => {
    setCookie(storageKey, data.mode)
  })
