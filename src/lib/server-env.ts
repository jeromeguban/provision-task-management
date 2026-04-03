function requireServerEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`)
  }

  return value
}

export function getDatabaseUrl() {
  const databaseUrl = requireServerEnv('DATABASE_URL')

  if (databaseUrl.includes('[YOUR-PASSWORD]')) {
    throw new Error(
      'DATABASE_URL still contains the placeholder [YOUR-PASSWORD]. Replace it with your real database password.',
    )
  }

  return databaseUrl
}

export function getSupabaseServerEnv() {
  return {
    supabaseUrl: requireServerEnv('SUPABASE_URL'),
    supabaseAnonKey: requireServerEnv('SUPABASE_ANON_KEY'),
  }
}
