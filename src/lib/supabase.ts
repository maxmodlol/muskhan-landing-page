import { createClient as createBrowserSupabaseSsr } from "@/utils/supabase/client"

export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  publishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "",
} as const

/** Server-side reservations API still uses the service role key. */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseEnv.url && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Browser Supabase client with cookie-aware SSR compatibility (`@supabase/ssr`).
 * Prefer importing from `@/utils/supabase/client` in new code.
 */
export function createBrowserSupabase() {
  return createBrowserSupabaseSsr()
}
