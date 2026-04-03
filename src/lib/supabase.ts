import { createServerClient } from '@supabase/ssr'
// @ts-ignore — alias resolves to @tanstack/start-server-core/dist/esm/h3.js
// bypassing rolldown's broken re-export chain in index.js
import { getEvent } from 'tss-h3-internals'
import { parseCookies, setCookie } from 'h3'
import { getSupabaseServerEnv } from '@/lib/server-env'

export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseServerEnv()
  const event = getEvent()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        const cookies = parseCookies(event)
        return Object.entries(cookies).map(([name, value]) => ({ name, value }))
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(event, name, value, options)
        }
      },
    },
  })
}
