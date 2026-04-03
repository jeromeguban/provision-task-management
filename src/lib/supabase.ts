import { createServerClient } from '@supabase/ssr'
import { parseCookies, setCookie } from '@tanstack/start-server-core'
import { getSupabaseServerEnv } from '@/lib/server-env'

export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseServerEnv()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        async getAll() {
          const cookies = (await parseCookies()) ?? {}

          return Object.entries(cookies).map(([name, value]) => ({
            name,
            value: value ?? '',
          }))
        },
        async setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            await setCookie(name, value, options)
          }
        },
      },
    },
  )
}
