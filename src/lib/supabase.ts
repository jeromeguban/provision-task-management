import { createServerClient } from '@supabase/ssr'
import { getEvent } from '@tanstack/start-server-core'
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
