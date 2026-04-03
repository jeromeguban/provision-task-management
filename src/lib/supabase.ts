import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie } from 'h3'
import { getSupabaseServerEnv } from '@/lib/server-env'
import type { H3Event } from 'h3'
// Named imports from @tanstack/start-server-core fail rolldown's static export
// analysis due to a re-export chain bug. Namespace import bypasses that check
// while still using the same ESM module instance (and AsyncLocalStorage) as
// TanStack Start's runtime.
import * as tssCore from '@tanstack/start-server-core'

const getEvent = (tssCore as unknown as { getEvent: () => H3Event }).getEvent

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
