import { createServerClient } from '@supabase/ssr'
import { getSupabaseServerEnv } from '@/lib/server-env'
// Keep this on the public React Start server entrypoint. It reuses the runtime
// AsyncLocalStorage-backed request context without importing TanStack's
// internal h3 file path directly, which is the part that breaks on Vercel.
import * as startServer from '@tanstack/react-start/server'

const { parseCookies, setCookie, setHeaders } = startServer as unknown as {
  parseCookies: () => Record<string, string>
  setCookie: (name: string, value: string, options?: unknown) => void
  setHeaders: (headers: HeadersInit) => void
}

export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseServerEnv()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = parseCookies()
        return Object.entries(cookies).map(([name, value]) => ({ name, value }))
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options)
        }

        setHeaders(headers)
      },
    },
  })
}
